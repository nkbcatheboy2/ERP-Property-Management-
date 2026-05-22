import React, { useState } from 'react';
import { Building2, Lock, User, ShieldCheck } from 'lucide-react';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple & Clean Super Admin Credentials
    if (username === 'admin' && password === 'admin123') {
      onLoginSuccess('Super Admin');
      alert('👑 Welcome back, Nitesh Bhardwaj!');
    } else if (username === 'operator' && password === 'operator123') {
      onLoginSuccess('Employee - Lottery');
      alert('👤 Welcome back, Operator!');
    } else {
      alert('❌ Invalid Username or Password! Please try again.');
    }
  };

  return (
    <div className="min-screen h-screen flex items-center justify-center bg-slate-100 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        
        {/* BRAND LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-md text-white mb-3">
            <Building2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wider">PROP-ERP SYSTEM</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Property Allotment & Infrastructure Portal</p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <User className="h-4 w-4 text-slate-400" />
              </span>
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium shadow-inner transition-all"
                placeholder="Enter (admin / operator)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-4 w-4 text-slate-400" />
              </span>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium shadow-inner transition-all"
                placeholder="Enter (admin123 / operator123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex gap-2 items-center">
            <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
            <p className="text-[10px] text-indigo-700 font-medium">
              Secured Session Gate. Role-based layouts apply automatically.
            </p>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition transform active:scale-95">
            Authenticate & Enter
          </button>
        </form>

      </div>
    </div>
  );
}

export default LoginPage;