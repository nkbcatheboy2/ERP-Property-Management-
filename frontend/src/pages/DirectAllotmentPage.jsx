import React, { useState } from 'react';
import { Landmark, PlusCircle, ShieldCheck, FileText } from 'lucide-react';

function DirectAllotmentPage() {
  const [allotments, setAllotments] = useState([
    { id: "DIR-801", orgName: "State Bank of India", propertyId: "320110", quota: "Institutional", date: "21-05-2026" }
  ]);

  const [form, setForm] = useState({ orgName: '', propertyId: '320110', quota: 'Institutional' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.orgName) return alert("Kripya Organisation ya Allottee ka naam dalein!");

    const currentDate = "21-05-2026"; // Current Date Format

    const newAllotment = {
      id: `DIR-${Math.floor(100 + Math.random() * 900)}`,
      orgName: form.orgName,
      propertyId: form.propertyId,
      quota: form.quota,
      date: currentDate
    };

    setAllotments([newAllotment, ...allotments]);
    setForm({ orgName: '', propertyId: '320110', quota: 'Institutional' });
    alert(`📜 Direct Allotment Letter Generated Successfully!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* BANNER */}
      <div className="bg-gradient-to-r from-rose-600 to-red-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl">
            <Landmark className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Direct & Institutional Allotment Desk</h2>
            <p className="text-xs text-rose-100 font-medium">Discretionary government quotas and institutional single-window asset locking.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2 text-sm uppercase tracking-wide">
            <PlusCircle className="text-rose-500 h-5 w-5" /> Issue Direct Order
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Allottee Agency / Name</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
                placeholder="e.g. Life Insurance Corporation"
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Discretionary Quota</label>
              <select 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-slate-700"
                value={form.quota}
                onChange={(e) => setForm({ ...form, quota: e.target.value })}
              >
                <option value="Institutional">Government / Institutional Body</option>
                <option value="Defense">Defense Personnel / Ex-Servicemen</option>
                <option value="FreedomFighter">Freedom Fighter Dependent Quota</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Property Reserved Code</label>
              <select 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-slate-700"
                value={form.propertyId}
                onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              >
                <option value="320110">Prop ID: 320110 (Omaxe City Group Housing)</option>
                <option value="554433">Prop ID: 554433 (Vrindavan Public Utility Plot)</option>
              </select>
            </div>

            <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-100 flex gap-2">
              <ShieldCheck className="h-5 w-5 text-rose-600 shrink-0" />
              <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                Policy Note: Direct allotment bypasses public lottery. Requires verified ministerial or board resolution upload.
              </p>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold py-3 rounded-xl text-sm shadow-md transition transform active:scale-95">
              Generate Allotment Letter
            </button>
          </form>
        </div>

        {/* RECODS TABLE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="font-extrabold text-slate-800 mb-5 text-sm uppercase tracking-wide">Direct Allotment Registry</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3.5 pl-4">Order ID</th>
                  <th className="p-3.5">Agency / Beneficiary</th>
                  <th className="p-3.5">Property ID</th>
                  <th className="p-3.5">Quota Type</th>
                  <th className="p-3.5 text-center">Issue Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {allotments.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition">
                    <td className="p-3.5 pl-4 font-mono font-bold text-slate-400">{item.id}</td>
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-rose-500" /> {item.orgName}
                    </td>
                    <td className="p-3.5 font-mono text-indigo-600 font-bold">{item.propertyId}</td>
                    <td className="p-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{item.quota}</td>
                    <td className="p-3.5 text-center font-mono text-slate-500 text-xs">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectAllotmentPage;