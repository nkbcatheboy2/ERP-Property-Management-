import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Ticket, User, Landmark, Sparkles } from 'lucide-react';

function LotteryPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', propertyType: 'EWS', regAmt: '5000' });

  // 1. Fetch Applicants from Backend Server on Load
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/applicants');
        setApplicants(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load applicants from server:", error);
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let amt = '5000';
    if (type === 'LIG') amt = '10000';
    if (type === 'Residential') amt = '50,000';
    setForm({ ...form, propertyType: type, regAmt: amt });
  };

  // 2. Submit New Applicant to Backend Server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Kripya Applicant ka naam dalein!");
    
    try {
      const payload = {
        name: form.name,
        type: form.propertyType
      };
      
      // Post request to backend API
      const response = await axios.post('http://localhost:5000/api/applicants', payload);
      
      // Update state instantly with server response
      setApplicants([response.data, ...applicants]);
      setForm({ name: '', propertyType: 'EWS', regAmt: '5000' });
      alert(`🎉 Application Saved on Server! Generated Prop ID: ${response.data.propertyId}`);
    } catch (error) {
      alert("Server connection failed while saving application.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Lottery Draw Entry Dashboard</h2>
            <p className="text-xs text-emerald-100 font-medium">Real-time applicant streaming straight from node server backend.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2 text-sm uppercase tracking-wide">
            <PlusCircle className="text-emerald-500 h-5 w-5" /> Applicant Registration
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Applicant Full Name</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-medium shadow-inner transition-all"
                placeholder="e.g. Amit Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Property Allocation Tier</label>
              <select 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700 transition-all"
                value={form.propertyType}
                onChange={handleTypeChange}
              >
                <option value="EWS">EWS Tier [Fee: ₹100 | Reg: ₹5,000]</option>
                <option value="LIG">LIG Tier [Fee: ₹500 | Reg: ₹10,000]</option>
                <option value="Residential">Commercial Tier [Fee: ₹2,100 | Reg: ₹50,000]</option>
              </select>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-xl border border-orange-100/70 flex justify-between items-center shadow-inner">
              <div>
                <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Required Registration Deposit</p>
                <p className="text-xl font-black text-orange-700 mt-0.5">₹{form.regAmt}</p>
              </div>
              <Landmark className="h-8 w-8 text-orange-400/70" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-emerald-600/10 transition transform active:scale-95">
              Generate Allotment Slip
            </button>
          </form>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="font-extrabold text-slate-800 mb-5 text-sm uppercase tracking-wide">Live Applicants Stream</h3>
          
          {loading ? (
            <div className="text-center py-10 font-bold text-slate-400">Loading live server records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3.5 pl-4">Slip ID</th>
                    <th className="p-3.5">Full Name</th>
                    <th className="p-3.5">Generated Property ID</th>
                    <th className="p-3.5">Tier</th>
                    <th className="p-3.5 text-center">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {applicants.map((app, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 pl-4 font-mono font-bold text-slate-400">{app.id}</td>
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /> {app.name}</td>
                      <td className="p-3.5 font-mono text-indigo-600 font-bold tracking-wide">{app.propertyId}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          app.type === 'EWS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>{app.type}</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-3 py-1 text-xs font-bold rounded-xl bg-green-100 text-green-800">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LotteryPage;