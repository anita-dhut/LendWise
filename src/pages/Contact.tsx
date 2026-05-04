import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const path = 'contact_submissions';
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, path));
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Get in touch</h2>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">Let's start a conversation.</h1>
            <p className="text-lg text-slate-600 mb-12">
              Have questions about our loan products or your application status? 
              Our team is here to help. Reach out through any of these channels.
            </p>

            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email us", value: "hello@lendwise.example" },
                { icon: Phone, label: "Call us", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Visit us", value: "123 Financial Plaza, New York, NY" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.label}</h4>
                    <p className="text-slate-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Message Sent!</h3>
                <p className="text-slate-600 mb-8">We'll get back to you as soon as possible.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl"
                  id="send-another-msg"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      id="contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      id="contact-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    id="contact-subject"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Message</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    id="contact-message"
                  />
                </div>
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  id="contact-submit"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
