import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LoanRequest } from '../../types';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  FileText,
  Save,
  Loader2,
  Trash2
} from 'lucide-react';
import { cn, formatDate, formatCurrency } from '../../lib/utils';

export default function AdminLoanDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<LoanRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (!id) return;

    const fetchLoan = async () => {
      try {
        const docRef = doc(db, 'loan_requests', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = { id: snapshot.id, ...snapshot.data() } as LoanRequest;
          setLoan(data);
          setNotes(data.adminNotes || '');
          setStatus(data.status);
        } else {
          navigate('/admin/dashboard');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `loan_requests/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'loan_requests', id);
      await updateDoc(docRef, {
        status,
        adminNotes: notes,
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `loan_requests/${id}`));
      
      setLoan(prev => prev ? { ...prev, status, adminNotes: notes } : null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-40">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  if (!loan) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/admin/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-8 transition-colors"
        id="back-to-dashboard"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 sm:p-12"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{loan.name}</h1>
                  <p className="text-slate-500 font-medium">Applied on {formatDate(loan.createdAt)}</p>
                </div>
              </div>
              <div className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest",
                loan.status === 'pending' && "bg-amber-100 text-amber-700",
                loan.status === 'approved' && "bg-emerald-100 text-emerald-700",
                loan.status === 'rejected' && "bg-red-100 text-red-700",
              )}>
                {loan.status}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email Address
                  </p>
                  <p className="font-bold text-slate-900">{loan.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Phone Number
                  </p>
                  <p className="font-bold text-slate-900">{loan.phone}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> Loan Category
                  </p>
                  <p className="font-bold text-slate-900 capitalize">{loan.loanType} Loan</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3" /> Total Request
                  </p>
                  <p className="text-3xl font-black text-slate-900">{formatCurrency(loan.amount)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Internal Notes Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg p-8 sm:p-12 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <FileText className="w-40 h-40" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Internal Assessment
            </h2>
            <textarea 
              placeholder="Add internal notes about this borrower, risk factors, or verification steps..."
              className="w-full h-48 bg-slate-50 border-none rounded-3xl p-6 focus:ring-2 focus:ring-slate-900 transition-all font-medium text-slate-700 resize-none"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              id="admin-notes-area"
            />
          </motion.div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
          >
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full blur-[80px] opacity-20"></div>
             
             <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-[0.2em] mb-8">Review Cabinet</h3>
             
             <div className="space-y-4 mb-10">
               {[
                 { id: 'approved', icon: CheckCircle, label: 'Approve Application', color: 'bg-emerald-500 hover:bg-emerald-600' },
                 { id: 'rejected', icon: XCircle, label: 'Reject Application', color: 'bg-red-500 hover:bg-red-600' },
                 { id: 'pending', icon: Clock, label: 'Wait/Pending', color: 'bg-slate-700 hover:bg-slate-600' }
               ].map((btn) => (
                 <button
                   key={btn.id}
                   onClick={() => setStatus(btn.id as any)}
                   className={cn(
                     "w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2",
                     status === btn.id 
                       ? "border-emerald-400 bg-emerald-400/10" 
                       : "border-transparent bg-white/5 hover:bg-white/10"
                   )}
                   id={`set-status-${btn.id}`}
                 >
                   <div className="flex items-center gap-3">
                     <btn.icon className={cn("w-5 h-5", status === btn.id ? "text-emerald-400" : "text-slate-400")} />
                     <span className="font-bold text-sm tracking-tight">{btn.label}</span>
                   </div>
                   {status === btn.id && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>}
                 </button>
               ))}
             </div>

             <button 
               onClick={handleUpdate}
               disabled={saving}
               className="w-full py-5 bg-emerald-500 text-slate-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
               id="save-changes-btn"
             >
               {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
             </button>
          </motion.div>

          <button 
            className="w-full py-4 bg-white border border-slate-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            id="admin-delete-loan"
          >
            <Trash2 className="w-4 h-4" />
            Archive Request
          </button>
        </div>
      </div>
    </div>
  );
}
