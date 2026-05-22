import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Gavel, PlusCircle, User, ArrowUpRight } from 'lucide-react';

function AuctionPage() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ bidderName: '', propertyId: '318720', basePrice: '1000000', currentBid: '' });

  // 1. Fetch Live Bids from Backend
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auctions');
        setBids(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch bids:", error);
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  // 2. Submit New Bid to Server
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bidderName || !form.currentBid) return alert("Kripya saari details bharein!");

    if (Number(form.currentBid) <= Number(form.basePrice)) {
      return alert("⚠️ Boli (Bid) hamesha Base Price se zyada honi chahiye!");
    }

    try {
      // Data ko hamesha explicitly numbers mein cast karke backend bhejein
      const payload = {
        bidderName: form.bidderName,
        propertyId: form.propertyId,
        basePrice: Number(form.basePrice),
        currentBid: Number(form.currentBid)
      };

      const response = await axios.post('http://localhost:5000/api/auctions', payload);
      setBids([response.data, ...bids]);
      setForm({ ...form, bidderName: '', currentBid: '' });
      alert("🎯 Boli Successfully Register Ho Gayi aur MongoDB mein Save ho gayi!");
    } catch (error) {
      alert(error.response?.data?.error || "Server error while placing bid.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl">
            <Gavel className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Live Commercial Auction Panel</h2>
            <p className="text-xs text-amber-100 font-medium">Bidding management stream linked directly to database records.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BID PLACEMENT FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2 text-sm uppercase tracking-wide">
            <PlusCircle className="text-amber-500 h-5 w-5" /> Place Live Bid
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bidder Full Name</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                placeholder="e.g. Nitesh Bhardwaj"
                value={form.bidderName}
                onChange={(e) => setForm({ ...form, bidderName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Commercial Property ID</label>
              <select 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-slate-700"
                value={form.propertyId}
                onChange={(e) => setForm({ ...form, propertyId: e.target.value, basePrice: e.target.value === '318720' ? '1000000' : '2500000' })}
              >
                <option value="318720">Prop ID: 318720 (Gomti Nagar LIG) [Base: ₹10,00,000]</option>
                <option value="429182">Prop ID: 429182 (Hazratganj Shop) [Base: ₹25,00,000]</option>
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase">Reserve Base Price:</span>
              <span className="text-sm font-bold text-slate-700">₹{Number(form.basePrice).toLocaleString('en-IN')}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Bid Amount (₹)</label>
              <input 
                type="number" 
                className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-amber-700 shadow-inner"
                placeholder="Must be higher than base price"
                value={form.currentBid}
                onChange={(e) => setForm({ ...form, currentBid: e.target.value })}
              />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 rounded-xl text-sm shadow-md transition transform active:scale-95">
              Submit High Bid
            </button>
          </form>
        </div>

        {/* BIDS STREAM DIRECTORY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="font-extrabold text-slate-800 mb-5 text-sm uppercase tracking-wide">Active Bidding Ledger</h3>
          
          {loading ? (
            <div className="text-center py-10 font-bold text-slate-400">Loading auction logs...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3.5 pl-4">Bid ID</th>
                    <th className="p-3.5">Bidder Name</th>
                    <th className="p-3.5">Property ID</th>
                    <th className="p-3.5">Base Price</th>
                    <th className="p-3.5 text-right">Current Bid Offer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {bids.map((bid, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 pl-4 font-mono font-bold text-slate-400">{bid.id}</td>
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /> {bid.bidderName}</td>
                      <td className="p-3.5 font-mono text-indigo-600 font-bold">{bid.propertyId}</td>
                      <td className="p-3.5 text-xs text-slate-400">₹{bid.basePrice?.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right font-black text-amber-600 font-mono">
                        <span className="inline-flex items-center gap-1">
                          ₹{bid.currentBid?.toLocaleString('en-IN')} <ArrowUpRight className="h-3.5 w-3.5 text-amber-500" />
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

export default AuctionPage;