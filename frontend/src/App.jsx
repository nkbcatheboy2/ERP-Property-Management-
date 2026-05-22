import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, Ticket, Gavel, Zap, ShieldAlert, 
  Users, Search, PlusCircle, LayoutDashboard, Landmark, FileText, LogOut
} from 'lucide-react';

import LotteryPage from './pages/LotteryPage';
import HrmsPage from './pages/HrmsPage';
import AuctionPage from './pages/AuctionPage';
import FcfsPage from './pages/FcfsPage';
import DirectAllotmentPage from './pages/DirectAllotmentPage';
import LoginPage from './pages/LoginPage'; // <-- Import Login Page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [currentRole, setCurrentRole] = useState('Super Admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [propertySearchId, setPropertySearchId] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return; // Fetch only if authenticated

    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        setSchemes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Backend offline, using mock data mode.");
        setSchemes([
          { id: "102938", type: "EWS (40 Sqm)", scheme: "Vrindavan Yojna", fee: "100", regAmt: "5,000", mode: "Lottery", status: "Active", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { id: "318720", type: "LIG (40-72 Sqm)", scheme: "Gomti Nagar", fee: "500", regAmt: "10,000", mode: "Auction", status: "Bidding Open", color: "text-amber-700 bg-amber-50 border-amber-200" },
          { id: "951200", type: "Residential/Shops", scheme: "Jankipuram Ext", fee: "2100", regAmt: "50,000", mode: "FCFS", status: "Available", color: "text-cyan-700 bg-cyan-50 border-cyan-200" },
          { id: "320110", type: "Group Housing", scheme: "Omaxe City", fee: "11,000", regAmt: "5,000,000", mode: "Direct Allotment", status: "Allotted", color: "text-rose-700 bg-rose-50 border-rose-200" }
        ]);
        setLoading(false);
      }
    };
    fetchProperties();
  }, [activeTab, isAuthenticated]);

  const handleLoginSuccess = (role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    alert('Logged out successfully!');
  };

  const handleAddSampleScheme = () => {
    const mockId = Math.floor(100000 + Math.random() * 900000).toString();
    const newProperty = {
      id: mockId,
      type: "MIG (Type-Sec-G)",
      scheme: "LDA Colony",
      fee: "2100",
      regAmt: "1,50,000",
      mode: "FCFS",
      color: "text-cyan-700 bg-cyan-50 border-cyan-200"
    };
    setSchemes([newProperty, ...schemes]);
    alert(`🎉 New Mock Scheme Created: ${mockId}`);
  };

  const hasAccess = (moduleName) => {
    if (currentRole === 'Super Admin') return true;
    if (currentRole === 'Employee - Lottery' && moduleName === 'Lottery') return true;
    return false;
  };

  // 🔒 GUARD CONDITION: If not logged in, show only Login Screen
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-68 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between shadow-2xl">
        <div>
          <div className="p-5 flex items-center gap-3 border-b border-indigo-900/50 bg-indigo-950/40">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-xl">
              <Building2 className="text-white h-6 w-6" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-300">PROP-ERP</span>
          </div>
          
          <div className="p-4">
            <p className="text-xs text-indigo-300/60 uppercase tracking-widest font-bold mb-4 pl-2">Main Modules</p>
            <nav className="space-y-1.5">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <LayoutDashboard className="h-5 w-5" /> Dashboard Overview
              </button>
              
              {hasAccess('Lottery') && (
                <button 
                  onClick={() => setActiveTab('lottery')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'lottery' ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  <Ticket className="h-5 w-5" /> 1. Lottery Module
                </button>
              )}

              <button 
                onClick={() => setActiveTab('auction')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'auction' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Gavel className="h-5 w-5" /> 2. Auction Module
              </button>

              <button 
                onClick={() => setActiveTab('fcfs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'fcfs' ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Zap className="h-5 w-5" /> 3. FCFS Module
              </button>

              <button 
                onClick={() => setActiveTab('direct')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'direct' ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
              >
                <Landmark className="h-5 w-5" /> 4. Direct Allotment
              </button>
            </nav>

            <p className="text-xs text-indigo-300/60 uppercase tracking-widest font-bold mt-6 mb-4 pl-2">HRMS & System</p>
            <nav className="space-y-1.5">
              {currentRole === 'Super Admin' && (
                <button 
                  onClick={() => setActiveTab('hrms')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'hrms' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  <Users className="h-5 w-5" /> Employee Management
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* LOGOUT BUTTON AREA */}
        <div className="p-4 bg-indigo-950/60 border-t border-indigo-900/40 m-3 rounded-2xl flex flex-col gap-2">
          <div className="text-xs font-semibold text-slate-300 px-2">
            Role: <span className="text-amber-400">{currentRole}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-rose-500/20"
          >
            <LogOut className="h-4 w-4" /> Logout Session
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-5 w-5 text-slate-400" />
            </span>
            <input 
              type="text" 
              maxLength={6}
              placeholder="Search Property ID..." 
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
              value={propertySearchId}
              onChange={(e) => setPropertySearchId(e.target.value)}
            />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">Nitesh Bhardwaj</p>
            <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-0.5 inline-block">{currentRole}</p>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">Property Management ERP</h1>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Real-time allotment summary metrics.</p>
                </div>
                <button 
                  onClick={handleAddSampleScheme}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm"
                >
                  <PlusCircle className="h-5 w-5" /> Test New Scheme
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-500 font-bold text-xs tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-6">Property ID</th>
                      <th className="py-3.5 px-6">Type Description</th>
                      <th className="py-3.5 px-6">Scheme / Area</th>
                      <th className="py-3.5 px-6">Proc. Fee</th>
                      <th className="py-3.5 px-6">Registration Amt</th>
                      <th className="py-3.5 px-6 text-center">Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
                    {schemes
                      .filter(item => propertySearchId === '' || item.id.includes(propertySearchId))
                      .map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6 font-bold text-indigo-600 font-mono tracking-wide">📂 {item.id}</td>
                          <td className="py-4 px-6 text-slate-900 font-semibold">{item.type}</td>
                          <td className="py-4 px-6 text-slate-500">{item.scheme}</td>
                          <td className="py-4 px-6 text-slate-600">₹{item.fee}</td>
                          <td className="py-4 px-6 font-bold text-slate-900">₹{item.regAmt}</td>
                          <td className="py-4 px-6 text-center">
                            <span className="px-3 py-1 text-xs font-bold rounded-xl border bg-slate-50 text-slate-700">
                              {item.mode}
                            </span>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'lottery' && <LotteryPage />}
          {activeTab === 'auction' && <AuctionPage />}
          {activeTab === 'fcfs' && <FcfsPage />}
          {activeTab === 'direct' && <DirectAllotmentPage />}
          {activeTab === 'hrms' && <HrmsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;