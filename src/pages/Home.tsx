import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Zap, ArrowRight, Users, TrendingUp, HandCoins } from 'lucide-react';
import { cn } from '../lib/utils';

export default function HomePage() {
  const features = [
    {
      title: "Fast Approvals",
      description: "Get your loan approved within 24 hours with our streamlined digital process.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      title: "Secure & Trusted",
      description: "Your data is encrypted and protected with enterprise-grade security protocols.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Low Interest Rates",
      description: "Competitive rates tailored to your financial profile and needs.",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    }
  ];

  const loanTypes = [
    { name: "Personal Loan", icon: HandCoins, description: "For life's big moments and emergencies." },
    { name: "Business Loan", icon: Briefcase, description: "Scale your venture with flexible capital." },
    { name: "Education Loan", icon: GraduationCap, description: "Invest in your future without the stress." },
    { name: "Home Loan", icon: Home, description: "Turn your dream house into a reality." }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-52 overflow-hidden bg-white">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-blue-200 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Trusted by 50,000+ borrowers
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Smart Loans for <span className="text-emerald-600 italic">Bolder</span> Futures.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl mb-10">
                LendWise offers transparent, fast, and secure financial solutions to help you achieve your goals. 
                Apply in minutes and get funded today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
                >
                  Apply for a Loan
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-50 text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all"
                >
                  How it Works
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 lg:mt-0 relative"
            >
              <div className="relative bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <HandCoins className="w-40 h-40 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Live Rates</h3>
                      <p className="text-slate-400 text-xs">Updated 2m ago</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { label: 'Personal', rate: '5.2%', trend: 'down' },
                      { label: 'Business', rate: '7.8%', trend: 'stable' },
                      { label: 'Home', rate: '3.4%', trend: 'down' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold">{item.rate}</span>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                            item.trend === 'down' ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                          )}>
                            {item.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                          <Users className="w-5 h-5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Join our community</p>
                  </div>
                </div>
              </div>
              
              {/* Floating element */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 hidden sm:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                    <p className="text-lg font-extrabold text-slate-900">99.8% Approval</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Why LendWise</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Designed for modern borrowers</h3>
            <p className="text-slate-600">We've removed the paperwork and the wait times. Get the capital you need precisely when you need it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8", feature.bg)}>
                  <feature.icon className={cn("w-7 h-7", feature.color)} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Missing icons from App.tsx imports in this file
import { Briefcase, GraduationCap, Home } from 'lucide-react';
