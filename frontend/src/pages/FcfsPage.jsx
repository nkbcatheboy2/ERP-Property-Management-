import React, { useState } from 'react';
import { Zap, PlusCircle, User, CheckCircle2 } from 'lucide-react';

function FcfsPage() {
  const [allotments, setAllotments] = useState([
    { id: "FCFS-101", name: "Rahul Verma", propertyId: "951200", time: "10:15:32 AM", status: "Allotted" }
  ]);

  const [form, setForm] = useState({ name: '', propertyId: '951200' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Kripya Applicant ka naam dalein!");

    // FCFS Rule: Instant timestamp generation for proof of priority
    const currentTime = new Date().toLocaleTimeString();

    const newAllotment = {
      id: `FCFS-${Math.floor(100 + Math.random() * 900)}`,
      name: form.name,
      propertyId: form.propertyId,
      time: currentTime,
      status: "Allotted"
    };

    setAllotments([newAllotment, ...allotments]);
    setForm({ name: '', propertyId: '951200' });
    alert(`🎉 Instant Allotment Successful at ${currentTime}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* BANNER */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Instant FCFS Allotment Desk</h2>
            <p className="text-xs text-cyan-100 font-medium">First-Come, First-Served automated system with millisecond-accurate timestamps.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2 text-sm uppercase tracking-wide">
            <PlusCircle className="text-cyan-500 h-5 w-5" /> Instant Booking Form
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Applicant Full Name</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium"
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Available FCFS Property</label>
              <select 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none font-semibold text-slate-700"
                value={form.propertyId}
                onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              >
                <option value="951200">Prop ID: 951200 (Jankipuram Commercial) [Available]</option>
                <option value="765432">Prop ID: 765432 (Aliganj Retail Shop) [Available]</option>
              </select>
            </div>

            <div className="bg-cyan-50 p-3.5 rounded-xl border border-cyan-100 flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-cyan-600 shrink-0" />
              <p className="text-[11px] text-cyan-700 font-medium leading-relaxed">
                FCFS Rule: No waitlist. Submitting this form freezes the asset instantly under the applicant's name.
              </p>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-xl text-sm shadow-md transition transform active:scale-95">
              Secure Asset Instantly
            </button>
          </form>
        </div>

        {/* LEDGER TABLE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="font-extrabold text-slate-800 mb-5 text-sm uppercase tracking-wide">Live Allotment Queue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3.5 pl-4">Queue ID</th>
                  <th className="p-3.5">Allottee Name</th>
                  <th className="p-3.5">Property ID</th>
                  <th className="p-3.5">Submission Time</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {allotments.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition">
                    <td className="p-3.5 pl-4 font-mono font-bold text-slate-400">{item.id}</td>
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-cyan-500" /> {item.name}
                    </td>
                    <td className="p-3.5 font-mono text-indigo-600 font-bold">{item.propertyId}</td>
                    <td className="p-3.5 font-mono text-slate-500 text-xs">{item.time}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-3 py-1 text-xs font-bold rounded-xl bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </td>
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

export default FcfsPage;