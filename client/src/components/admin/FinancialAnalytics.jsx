import React, { useMemo } from "react";
import { FiDollarSign, FiTrendingUp, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const FinancialAnalytics = ({ fees, fines }) => {
  const stats = useMemo(() => {
    const totalFees = fees.reduce((acc, f) => acc + (f.amount || 0), 0);
    const paidFees = fees.filter(f => f.status === "paid").reduce((acc, f) => acc + (f.amount || 0), 0);
    const pendingFees = totalFees - paidFees;

    const totalFines = fines.reduce((acc, f) => acc + (f.amount || 0), 0);
    const paidFines = fines.filter(f => f.status === "paid").reduce((acc, f) => acc + (f.amount || 0), 0);
    const pendingFines = totalFines - paidFines;

    return {
      totalRevenue: totalFees + totalFines,
      collectedRevenue: paidFees + paidFines,
      pendingRevenue: pendingFees + pendingFines,
      collectionRate: totalFees + totalFines > 0 
        ? Math.round(((paidFees + paidFines) / (totalFees + totalFines)) * 100) 
        : 0
    };
  }, [fees, fines]);

  // Group fees by month for a trend chart
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const collection = Array(12).fill(0);
    
    fees.filter(f => f.status === "paid" && f.paidDate).forEach(f => {
      const month = new Date(f.paidDate).getMonth();
      collection[month] += (f.amount || 0);
    });

    const max = Math.max(...collection, 1);
    return months.map((m, i) => ({
      month: m,
      value: collection[i],
      height: (collection[i] / max) * 100
    }));
  }, [fees]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-neutral-3">Financial Analytics</h2>
        <div className="text-sm font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
          Live Data
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={<FiDollarSign className="text-blue-500" />} 
          color="bg-blue-50"
        />
        <StatCard 
          label="Collected" 
          value={`₹${stats.collectedRevenue.toLocaleString()}`} 
          icon={<FiCheckCircle className="text-green-500" />} 
          color="bg-green-50"
        />
        <StatCard 
          label="Pending Dues" 
          value={`₹${stats.pendingRevenue.toLocaleString()}`} 
          icon={<FiAlertCircle className="text-orange-500" />} 
          color="bg-orange-50"
        />
        <StatCard 
          label="Collection Rate" 
          value={`${stats.collectionRate}%`} 
          icon={<FiTrendingUp className="text-purple-500" />} 
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart (CSS Bar Chart) */}
        <div className="lg:col-span-2 bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-3 mb-6">Fee Collection Trend (Annual)</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div 
                  className="w-full bg-primary/20 rounded-t-md group-hover:bg-primary transition-all duration-500 cursor-pointer relative"
                  style={{ height: `${d.height}%`, minHeight: '2px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-3 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    ₹{d.value.toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] text-neutral-3/50 mt-2 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-neutral-2 p-6 rounded-2xl border border-neutral-1 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-neutral-3 mb-4">Revenue Breakdown</h3>
          <div className="space-y-4 flex-1">
            <BreakdownItem label="Regular Fees" amount={stats.collectedRevenue} total={stats.totalRevenue} color="bg-primary" />
            <BreakdownItem label="Fines & Penalties" amount={fines.filter(f => f.status === 'paid').reduce((a, b) => a + b.amount, 0)} total={stats.totalRevenue} color="bg-secondary" />
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-xs text-neutral-3/70">
              Collection efficiency is at <span className="font-bold text-primary">{stats.collectionRate}%</span>. 
              {stats.collectionRate < 80 ? " Target intensive follow-ups for pending dues." : " Keeping up a great pace!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className={`${color} p-6 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4`}>
    <div className="p-3 bg-white rounded-xl shadow-sm text-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-neutral-3/50 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-neutral-3">{value}</p>
    </div>
  </div>
);

const BreakdownItem = ({ label, amount, total, color }) => {
  const percent = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold text-neutral-3">
        <span>{label}</span>
        <span>₹{amount.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-neutral-1 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default FinancialAnalytics;
