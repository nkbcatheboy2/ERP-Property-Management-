import React, { useState } from 'react';
import { Users, PlusCircle, Shield, UserCheck, Eye, EyeOff } from 'lucide-react';

function HrmsPage() {
  const [employees, setEmployees] = useState([
    { id: "EMP-01", name: "Anubhav Sharma", role: "Operator", authority: "Lottery Only", status: "Active" },
    { id: "EMP-02", name: "Vikram Singh", role: "Manager", authority: "All Modules", status: "Active" }
  ]);

  const [form, setForm] = useState({ name: '', role: 'Operator', authority: 'Lottery' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Kripya Employee ka naam dalein!");

    const newEmp = {
      id: `EMP-${Math.floor(10 + Math.random() * 90)}`,
      name: form.name,
      role: form.role,
      authority: form.authority === 'Lottery' ? 'Lottery Only' : 'All Modules',
      status: "Active"
    };

    setEmployees([newEmp, ...employees]);
    setForm({ name: '', role: 'Operator', authority: 'Lottery' });
    alert("New Employee Added with custom authorities! 👤✨");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* BANNER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">HRMS & Permission Management</h2>
            <p className="text-xs text-indigo-100 font-medium">Add internal employees and manage role-based access control (RBAC).</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD EMPLOYEE FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2 text-sm uppercase tracking-wide">
            <PlusCircle className="text-indigo-500 h-5 w-5" /> Onboard Employee
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Employee Full Name</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none font-medium transition-all"
                placeholder="e.g. Anubhav Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Designation Role</label>
              <select 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-700"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="Operator">System Operator</option>
                <option value="Manager">Project Manager</option>
                <option value="Auditor">Authority Auditor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Module Scope Authority</label>
              <select 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-700"
                value={form.authority}
                onChange={(e) => setForm({ ...form, authority: e.target.value })}
              >
                <option value="Lottery">Restrict to: 1. Lottery Module Only</option>
                <option value="All">Full Access: All 4 Allotment Modes</option>
              </select>
            </div>

            <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-100 flex gap-2.5 items-start">
              <Shield className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                Security Rule: Restricted operators will maintain Read-Only access to global properties count but cannot view setup settings.
              </p>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-indigo-600/10 transition transform active:scale-95">
              Save & Assign Authority
            </button>
          </form>
        </div>

        {/* STAFF DIRECTORY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="font-extrabold text-slate-800 mb-5 text-sm uppercase tracking-wide">Active Staff & Access Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3.5 pl-4">Emp ID</th>
                  <th className="p-3.5">Staff Name</th>
                  <th className="p-3.5">Designation</th>
                  <th className="p-3.5">Assigned Scope</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {employees.map((emp, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition">
                    <td className="p-3.5 pl-4 font-mono font-bold text-slate-400">{emp.id}</td>
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-indigo-500" /> {emp.name}
                    </td>
                    <td className="p-3.5 text-slate-500 text-xs uppercase font-bold tracking-wider">{emp.role}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 w-fit ${
                        emp.authority === 'All Modules' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {emp.authority === 'All Modules' ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {emp.authority}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-3 py-1 text-xs font-bold rounded-xl bg-green-100 text-green-800">
                        {emp.status}
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

export default HrmsPage;