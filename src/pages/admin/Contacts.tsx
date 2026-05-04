import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ContactSubmission } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Mail, 
  User, 
  Calendar, 
  MessageSquare,
  AlertCircle,
  Search
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission));
        setSubmissions(data);
        setLoading(false);
      },
      (err) => {
        setError("Access Denied. You do not have permission to view contact inquiries.");
        setLoading(false);
        handleFirestoreError(err, OperationType.LIST, 'contact_submissions');
      }
    );

    return () => unsubscribe();
  }, []);

  const deleteSubmission = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await deleteDoc(doc(db, 'contact_submissions', id)).catch(err => handleFirestoreError(err, OperationType.DELETE, `contact_submissions/${id}`));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = submissions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-20 animate-pulse text-slate-400 font-mono">LOADING_INQUIRIES...</div>;

  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-xl border border-red-100 text-center text-red-600 font-bold">
      {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight italic">Messages</h1>
          <p className="text-slate-500 font-medium">Customer inquiries and support requests.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search messages..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            id="contact-search"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((sub) => (
            <motion.div
              key={sub.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 truncate">{sub.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {sub.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-50">
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Subject</p>
                   <p className="font-bold text-slate-900 leading-tight">{sub.subject}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                     <MessageSquare className="w-3 h-3" /> Message
                   </p>
                   <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl italic">
                     "{sub.message}"
                   </p>
                </div>
              </div>

              <div className="mt-6 pt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(sub.createdAt)}
                </div>
                <button 
                  onClick={() => deleteSubmission(sub.id!)}
                  className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  id={`delete-contact-${sub.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-40 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
           <Mail className="w-12 h-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-medium italic">Inbox is empty.</p>
        </div>
      )}
    </div>
  );
}
