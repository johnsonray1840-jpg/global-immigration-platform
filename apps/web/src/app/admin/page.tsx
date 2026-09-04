'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Briefcase, DollarSign, Globe2, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [countryDemand, setCountryDemand] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, demandRes, activityRes] = await Promise.all([
          api.get('/admin/analytics/overview'),
          api.get('/admin/analytics/country-demand'),
          api.get('/admin/analytics/activity'),
        ]);
        setOverview(overviewRes.data);
        setCountryDemand(demandRes.data);
        setRecentActivity(activityRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load dashboard data. Please refresh.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: overview?.totalUsers || 0, icon: Users, color: 'text-[#0B5D66]', bg: 'bg-[#0B5D66]/10' },
    { label: 'Total Cases', value: overview?.totalCases || 0, icon: Briefcase, color: 'text-[#0B5D66]', bg: 'bg-[#0B5D66]/10' },
    { label: 'Total Revenue', value: `$${(overview?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-[#C9A96E]', bg: 'bg-[#C9A96E]/20' },
    { label: 'Countries', value: overview?.totalCountries || 0, icon: Globe2, color: 'text-[#0B5D66]', bg: 'bg-[#0B5D66]/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="font-display text-2xl font-semibold text-[#111827]">{stat.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Country Demand & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0B5D66]" />
            <h3 className="font-display text-xl font-semibold text-[#111827]">Top Destination Countries</h3>
          </div>
          <div className="mt-4 space-y-3">
            {countryDemand.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              countryDemand.map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                  <span className="text-sm text-gray-600">
                    {item._count?.destinationCountryId || 0} cases
                  </span>
                  <span className="text-sm font-medium text-[#111827]">
                    {item.destinationCountryId || 'Unknown'}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#0B5D66]" />
            <h3 className="font-display text-xl font-semibold text-[#111827]">Recent Activity</h3>
          </div>
          <div className="mt-4 space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity.</p>
            ) : (
              recentActivity.slice(0, 5).map((log, i) => (
                <div key={log.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                  <span className="text-sm text-gray-600">
                    {log.action} • {log.entity}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}