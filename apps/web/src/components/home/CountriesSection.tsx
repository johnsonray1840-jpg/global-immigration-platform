'use client';

import { SectionHeading } from '@/components/shared/section-heading';
import { Globe, MapPin, TrendingUp, Shield, Award, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const featuredCountries = [
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    description: 'World-class healthcare, education, and quality of life',
    programs: ['Express Entry', 'Provincial Nominee', 'Start-up Visa'],
    processingTime: '6-12 months',
    approvalRate: '92%',
    color: 'from-red-500 to-red-600',
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    description: 'Sunshine lifestyle with robust economy and migration pathways',
    programs: ['Skilled Independent', 'Employer Sponsored', 'Business Innovation'],
    processingTime: '8-14 months',
    approvalRate: '89%',
    color: 'from-blue-500 to-yellow-500',
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    description: 'Breathtaking landscapes with welcoming immigration policies',
    programs: ['Skilled Migrant', 'Green List', 'Entrepreneur Visa'],
    processingTime: '6-10 months',
    approvalRate: '91%',
    color: 'from-blue-600 to-blue-800',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    description: 'Historic prestige with post-Brexit talent attraction programs',
    programs: ['Skilled Worker', 'Global Talent', 'Innovator Founder'],
    processingTime: '3-8 weeks',
    approvalRate: '87%',
    color: 'from-blue-800 to-red-700',
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    description: 'Land of opportunity with diverse visa categories',
    programs: ['EB-5 Investor', 'O-1 Extraordinary', 'H-1B Specialty'],
    processingTime: '6-18 months',
    approvalRate: '85%',
    color: 'from-blue-700 to-red-600',
  },
  {
    code: 'AE',
    name: 'UAE (Dubai)',
    flag: '🇦🇪',
    description: 'Tax-free income with rapid business growth opportunities',
    programs: ['Golden Visa', 'Green Visa', 'Freelancer Permit'],
    processingTime: '2-4 weeks',
    approvalRate: '94%',
    color: 'from-green-600 to-red-600',
  },
];

const stats = [
  { icon: Globe, value: '50+', label: 'Countries Covered' },
  { icon: Award, value: '98%', label: 'Client Satisfaction' },
  { icon: Shield, value: '100%', label: 'Compliance Rate' },
  { icon: Users, value: '10K+', label: 'Successful Cases' },
];

export default function CountriesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F8FAFA]">
      <div className="container-premium">
        <SectionHeading
          title="Explore Top Destinations"
          subtitle="Discover premium immigration pathways to the world's most sought-after countries"
          centered
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
            >
              <stat.icon className="h-8 w-8 text-[#0B5D66] mb-3" />
              <div className="text-3xl font-bold text-[#111827]">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Featured Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCountries.map((country, index) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Header with Gradient */}
              <div className={`bg-gradient-to-r ${country.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="text-5xl">{country.flag}</div>
                  <Globe className="h-8 w-8 opacity-50" />
                </div>
                <h3 className="mt-4 text-2xl font-bold">{country.name}</h3>
                <p className="mt-2 text-sm opacity-90">{country.description}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Programs */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Programs</h4>
                  <div className="flex flex-wrap gap-2">
                    {country.programs.map((program) => (
                      <span
                        key={program}
                        className="px-3 py-1 text-xs rounded-full bg-[#E8EEEE] text-[#0B5D66] font-medium"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      Processing Time
                    </div>
                    <div className="mt-1 font-semibold text-[#111827]">{country.processingTime}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      Approval Rate
                    </div>
                    <div className="mt-1 font-semibold text-[#111827]">{country.approvalRate}</div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href={`/countries/${country.code.toLowerCase()}`}>
                  <button className="mt-6 w-full py-3 px-4 bg-[#0B5D66] hover:bg-[#0a4c55] text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-[#0B5D66] group-hover:to-[#C9A96E]">
                    Explore Pathways
                    <MapPin className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 text-center">
          <Link href="/countries">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0B5D66] to-[#0a4c55] hover:from-[#0a4c55] hover:to-[#0B5D66] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              <Globe className="h-5 w-5" />
              View All Countries
            </button>
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Explore detailed information about visa requirements, costs, and application processes
          </p>
        </div>
      </div>
    </section>
  );
}
