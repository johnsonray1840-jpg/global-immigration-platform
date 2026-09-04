'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, Users, Briefcase, DollarSign, Globe2, Activity, FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['#0B5D66', '#C9A96E', '#111827', '#4DA8FF', '#B0B0B0'];

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [countryDemand, setCountryDemand] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, demandRes, activityRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/country-demand'),
        api.get('/admin/analytics/activity'),
      ]);
      setOverview(overviewRes.data);
      // Ensure countryDemand has correct shape; map to usable format
      const demand = demandRes.data?.map((item: any) => ({
        destinationCountryId: item.destinationCountryId || 'Unknown',
        cases: item._count?._all || item._count?.destinationCountryId || 0,
      })) || [];
      setCountryDemand(demand);
      setActivity(activityRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      toast.error('Failed to load analytics');
      setError(true);
      setLoading(false);
    }
  };

  const pieData = countryDemand.map((c) => ({
    name: c.destinationCountryId,
    value: c.cases,
  }));

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load analytics. Please try again.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Users', value: overview?.totalUsers || 0, icon: Users },
    { label: 'Cases', value: overview?.totalCases || 0, icon: Briefcase },
    { label: 'Revenue', value: `$${(overview?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign },
    { label: 'Countries', value: overview?.totalCountries || 0, icon: Globe2 },
    { label: 'Payments', value: overview?.totalPayments || 0, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-semibold text-[#111827]">Analytics Dashboard</h2>
        <p className="mt-2 text-sm text-gray-500">Real-time performance metrics and immigration demand.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                <stat.icon className="h-5 w-5 text-[#0B5D66]" />
              </div>
              <p className="mt-3 text-sm text-gray-500">{stat.label}</p>
              <p className="font-display text-2xl font-semibold text-[#111827]">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-[#111827]">
            <Globe2 className="h-5 w-5 text-[#0B5D66]" /> Country Demand
          </h3>
          <div className="mt-4 h-72">
            {countryDemand.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-400">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryDemand}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EEEE" />
                  <XAxis dataKey="destinationCountryId" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cases" fill="#0B5D66" name="Cases" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-[#111827]">
            <TrendingUp className="h-5 w-5 text-[#C9A96E]" /> Distribution
          </h3>
          <div className="mt-4 h-72">
            {pieData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-400">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#0B5D66" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-[#111827]">
          <Activity className="h-5 w-5 text-[#0B5D66]" /> Recent Activity
        </h3>
        <div className="mt-4 space-y-3">
          {activity.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            activity.map((log) => (
              <div key={log.id} className="flex flex-col gap-2 border-b border-gray-100 pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#111827]">{log.action} {log.entity}</p>
                  <p className="text-xs text-gray-500">{log.user?.email || 'System'}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}