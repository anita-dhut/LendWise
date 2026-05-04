import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Home, 
  Briefcase, 
  Info, 
  Mail, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  PiggyBank
} from 'lucide-react';
import { cn } from './lib/utils';

// Pages
import HomePage from './pages/Home';
import ServicesPage from './pages/Services';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import MyLoansPage from './pages/MyLoans';
import AdminLoginPage from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLoanDetails from './pages/admin/LoanDetails';
import AdminContacts from './pages/admin/Contacts';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const userNavItems = [
    ...navItems,
    { name: 'My Loans', path: '/my-loans', icon: PiggyBank },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Contacts', path: '/admin/contacts', icon: Mail },
  ];

  const activeItems = isAdminPath ? adminNavItems : (user ? userNavItems : navItems);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">LendWise</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {activeItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-600 px-3 py-2 rounded-md",
                  location.pathname === item.path ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
                )}
              >
                {item.name}
              </Link>
            ))}
            {user && isAdminPath && (
              <button 
                onClick={() => auth.signOut()}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                id="logout-btn"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
            {!isAdminPath && (
              <Link 
                to="/admin/login" 
                className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {activeItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    location.pathname === item.path ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              {user && isAdminPath && (
                <button 
                  onClick={() => {
                    auth.signOut();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                  id="mobile-logout-btn"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <PiggyBank className="w-8 h-8 text-emerald-500" />
            <span className="font-bold text-2xl tracking-tight text-white">LendWise</span>
          </Link>
          <p className="max-w-xs leading-relaxed">
            Empowering your financial future with smart, accessible, and transparent loan solutions. 
            Join thousands of satisfied customers today.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Connect</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">Contact Us</Link></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">LinkedIn</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Legal</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-xs text-center font-mono uppercase tracking-tighter">
        © {new Date().getFullYear()} LendWise Financial Inc. All rights reserved.
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200">
        <Navigation />
        <main className="flex-grow pt-16">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/my-loans" element={<MyLoansPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/loan/:id" element={<AdminLoanDetails />} />
            <Route path="/admin/contacts" element={<AdminContacts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
