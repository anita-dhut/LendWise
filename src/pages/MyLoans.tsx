import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { LoanRequest as LoanRequestType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  PiggyBank,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { cn, formatDate, formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function MyLoansPage() {
  const [loans, setLoans] = useState<LoanRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, 'loan_requests'),
      where('email', '==', user.email),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LoanRequestType));
        setLoans(data);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'loan_requests');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Fetching your applications...</p>
    </div>
  );

  if (!user) return (
    <div className="max-w-md mx-auto my-32 p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <LogIn className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Sign in to view your loans</h2>
      <p className="text-slate-600 mb-8">Please log in with the email you used to apply for your loan.</p>
      <Link 
        to="/admin/login" 
        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
      >
        Go to Login
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight italic">My Loans</h1>
          <p className="text-slate-500 font-medium">Track the status of your applications.</p>
        </div>
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
          <History className="w-7 h-7 text-emerald-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {loans.map((loan) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
                    <PiggyBank className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900 text-xl capitalize">{loan.loanType} Loan</h3>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        loan.status === 'pending' && "bg-amber-100 text-amber-700",
                        loan.status === 'approved' && "bg-emerald-100 text-emerald-700",
                        loan.status === 'rejected' && "bg-red-100 text-red-700",
                      )}>
                        {loan.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatDate(loan.createdAt)}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span>ID: {loan.id?.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-8 bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(loan.amount)}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-300 hidden sm:block" />
                </div>
              </div>

              {loan.adminNotes && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <AlertCircle className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="relative font-medium text-blue-800 text-sm italic">
                    <span className="font-bold block text-[10px] uppercase tracking-widest mb-2 text-blue-600 not-italic">Internal Update</span>
                    "{loan.adminNotes}"
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loans.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <PiggyBank className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium italic mb-8">You haven't submitted any loan requests yet.</p>
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
