import { motion } from 'motion/react';
import { Target, Heart, Shield, Award, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: "Founded", value: "2018" },
    { label: "Active Users", value: "50k+" },
    { label: "Interest Rate", value: "3.2%+" },
    { label: "Approvals", value: "99%" },
  ];

  const values = [
    { title: "Transparency", icon: Shield, desc: "We believe in clear terms, no hidden fees, and honest communication." },
    { title: "Inclusion", icon: Users, desc: "Financial opportunities for everyone, regardless of their background." },
    { title: "Innovation", icon: Target, desc: "Leveraging technology to make lending faster and more accessible." },
    { title: "Integrity", icon: Award, desc: "Doing the right thing for our customers and our community." },
  ];

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Intro */}
        <div className="max-w-3xl mb-24">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Our Mission</h2>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-8 tracking-tight italic">Financial Freedom for Everyone.</h1>
          <p className="text-xl text-slate-600 leading-relaxed shadow-sm p-8 bg-white rounded-3xl border border-slate-100">
            Founded with a vision to revolutionize the lending industry, LendWise has grown from a small startup into a leading financial technology platform. 
            We combine high-tech solutions with high-touch human service to ensure you get more than just a loan—you get a partner in your financial journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-900 p-8 rounded-[2rem] text-center">
              <p className="text-4xl font-extrabold text-white mb-2">{stat.value}</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {values.map((value, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                <value.icon className="w-7 h-7 text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
              <p className="text-slate-600 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Global Network</h2>
          <h3 className="text-4xl font-bold text-slate-900 mb-12 italic">Supporting dreamers worldwide.</h3>
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-100 aspect-[21/9] flex items-center justify-center">
             <Globe className="w-48 h-48 text-slate-200 animate-pulse" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
