import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PiggyBank, 
  Briefcase, 
  GraduationCap, 
  Home as HomeIcon, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { LoanType } from '../types';

export default function ServicesPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    loanType: '' as LoanType,
    amount: '',
  });

  const loanOptions = [
    { id: 'personal', title: 'Personal Loan', icon: PiggyBank, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'business', title: 'Business Loan', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'home', title: 'Home Loan', icon: HomeIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'education', title: 'Education Loan', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.loanType) throw new Error("Please select a loan type");
      
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      const path = 'loan_requests';
      await addDoc(collection(db, path), payload).catch(err => handleFirestoreError(err, OperationType.CREATE, path));
      
      setIsSuccess(true);
      setStep(3);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Loan Inquiry</h1>
          <p className="text-slate-600">Complete the form below to start your application process.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Progress Bar */}
          <div className="flex h-1.5 bg-slate-100">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="bg-emerald-500"
            />
          </div>

          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-8">What type of loan do you need?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loanOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setFormData({ ...formData, loanType: opt.id as LoanType });
                          setStep(2);
                        }}
                        className={cn(
                          "group flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all",
                          formData.loanType === opt.id 
                            ? "border-emerald-500 bg-emerald-50" 
                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                        )}
                        id={`loan-type-${opt.id}`}
                      >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", opt.bg)}>
                          <opt.icon className={cn("w-6 h-6", opt.color)} />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-slate-900">{opt.title}</h3>
                          <p className="text-xs text-slate-500">Fast processing, low rates</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button 
                    onClick={() => setStep(1)}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 flex items-center gap-1"
                    id="back-step-1"
                  >
                    ← Change loan type
                  </button>
                  <h2 className="text-2xl font-bold text-slate-900 mb-8">Tell us more about yourself</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest px-1">Full Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          id="input-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest px-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          id="input-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest px-1">Phone Number</label>
                        <input 
                          required
                          type="tel" 
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          id="input-phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest px-1">Loan Amount ($)</label>
                        <input 
                          required
                          type="number" 
                          placeholder="5000"
                          min="500"
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          value={formData.amount}
                          onChange={e => setFormData({...formData, amount: e.target.value})}
                          id="input-amount"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      id="submit-loan"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && isSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h2>
                  <p className="text-slate-600 max-w-sm mx-auto mb-10">
                    Thank you, {formData.name}. Our financial specialists will review your application and contact you within 24 hours.
                  </p>
                  <button 
                    onClick={() => {
                      setStep(1);
                      setIsSuccess(false);
                      setFormData({ name: '', email: '', phone: '', loanType: '' as LoanType, amount: '' });
                    }}
                    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
                    id="apply-another"
                  >
                    Back to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence } from 'motion/react';
