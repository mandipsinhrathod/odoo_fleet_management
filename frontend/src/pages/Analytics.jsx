import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts'
import {
    BarChart3, TrendingUp, Zap, Users,
    Truck, Target, Calendar, Download,
    Filter, Maximize2, Activity, Shield
} from 'lucide-react'

const Analytics = () => {
    const [efficiencyData, setEfficiencyData] = useState([])
    const [sectorData, setSectorData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('http://localhost:8000/stats/analytics-data', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                setEfficiencyData(response.data.efficiencyData)
                setSectorData(response.data.sectorData)
            } catch (error) {
                console.error("Failed to fetch intelligence", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [])

    const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f43f5e', '#f59e0b']

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center">
                        <BarChart3 className="mr-3 text-brand-500" size={32} />
                        Fleet Intelligence
                    </h1>
                    <p className="text-slate-500 font-medium ml-1">Advanced data visualizations and predictive analytics.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
                        <Download size={20} />
                    </button>
                    <button className="glow-button flex items-center space-x-2 bg-brand-500 text-white shadow-md shadow-brand-500/20 hover:bg-brand-600">
                        <Target size={20} />
                        <span>Export Data</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Detailed Performance Graph */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Operational Throughput</h3>
                        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                            <span className="flex items-center"><span className="w-2.5 h-2.5 bg-brand-500 rounded-sm mr-2" /> Efficiency</span>
                            <span className="flex items-center"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm mr-2 border border-indigo-500 border-dashed" bg-transparent /> Payload</span>
                        </div>
                    </div>

                    <div className="h-[360px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={efficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradientEff" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 700 }}
                                />
                                <Area type="monotone" dataKey="efficiency" stroke="#0ea5e9" strokeWidth={3} fill="url(#gradientEff)" />
                                <Area type="monotone" dataKey="load" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Distribution Hub */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden"
                >
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Sector Density</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sectorData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {sectorData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                                    itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 700 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-6">
                        {sectorData.map((s, i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{s.name}</p>
                                    <p className="text-sm font-black text-slate-900">{s.value} units</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-2">
                {[
                    { label: "Neural Load Velocity", value: "240ms", icon: Zap, color: "text-brand-500", bg: "bg-brand-50" },
                    { label: "Predictive Health", value: "Optimal", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Data Integrity", value: "99.9%", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-50" },
                    { label: "Active Nodes", value: "128", icon: Truck, color: "text-rose-500", bg: "bg-rose-50" }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group">
                        <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                            <item.icon size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                            <p className="text-lg font-black text-slate-900">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Analytics
