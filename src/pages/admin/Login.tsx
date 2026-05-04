import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert, Key } from 'lucide-react';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // Rules will prevent access to dashboard if not admin, 
      // so we can just navigate and let the dashboard handle unauthorized state.
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 text-center"
      >
        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Key className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 italic">Admin Panel</h1>
        <p className="text-slate-600 mb-10">Secure access for authorized personnel only.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 group"
          id="admin-auth-btn"
        >
          {isLoading ? (
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Sign in with Google
            </>
          )}
        </button>

        <p className="mt-8 text-xs text-slate-400 font-medium uppercase tracking-[0.2em]">
          Protected by Enterprise Shield
        </p>
      </motion.div>
    </div>
  );
}
