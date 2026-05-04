import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { LoanRequest } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  Clock,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { cn, formatDate, formatCurrency } from '../../lib/utils';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'loan_requests'), orderBy('createdAt', sortOrder));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LoanRequest));
        setRequests(data);
        setLoading(false);
      },
      (err) => {
        setError("Access Denied. You do not have permission to view this panel.");
        setLoading(false);
        handleFirestoreError(err, OperationType.LIST, 'loan_requests');
      }
    );

    return () => unsubscribe();
  }, [sortOrder]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const docRef = doc(db, 'loan_requests', id);
      await updateDoc(docRef, { status }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `loan_requests/${id}`));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      const docRef = doc(db, 'loan_requests', id);
      await deleteDoc(docRef).catch(err => handleFirestoreError(err, OperationType.DELETE, `loan_requests/${id}`));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         req.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Synchronizing Data...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-xl border border-red-100 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Unauthorized</h2>
      <p className="text-slate-600 mb-8">{error}</p>
      <button 
        onClick={() => navigate('/admin/login')}
        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl"
        id="re-login-btn"
      >
        Return to Login
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight italic">Loan Requests</h1>
          <p className="text-slate-500 font-medium">Manage and review incoming applications in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {requests.length} Total Requests
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            id="admin-search"
          />
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto">
          <select 
            className="flex-grow lg:flex-none px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 appearance-none pr-10 relative"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            id="status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 text-slate-600 transition-all border border-transparent active:scale-95"
            id="sort-btn"
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-900">
              <th className="px-6 py-5 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Date</th>
              <th className="px-6 py-5 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Customer</th>
              <th className="px-6 py-5 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Loan Type</th>
              <th className="px-6 py-5 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Amount</th>
              <th className="px-6 py-5 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] font-mono">Status</th>
              <th className="px-6 py-5 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {filteredRequests.map((req) => (
                <motion.tr 
                  key={req.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-emerald-50/30 transition-colors"
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
                      <Clock className="w-3 h-3" />
                      {formatDate(req.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-bold text-slate-900">{req.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{req.email}</div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 rounded-md text-slate-600">
                      {req.loanType}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-extrabold text-slate-900">{formatCurrency(req.amount)}</div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      req.status === 'pending' && "bg-amber-100 text-amber-700",
                      req.status === 'approved' && "bg-emerald-100 text-emerald-700",
                      req.status === 'rejected' && "bg-red-100 text-red-700",
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        req.status === 'pending' && "bg-amber-500",
                        req.status === 'approved' && "bg-emerald-500",
                        req.status === 'rejected' && "bg-red-500",
                      )}></span>
                      {req.status}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/loan/${req.id}`}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="View Details"
                        id={`view-details-${req.id}`}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => deleteRequest(req.id!)}
                        className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                        title="Delete"
                        id={`delete-${req.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="text-slate-400 font-medium italic">No requests found matching your filters.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
