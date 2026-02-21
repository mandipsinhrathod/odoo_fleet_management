import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts'
import {
    TrendingUp, Truck, AlertCircle, Box,
    ArrowUpRight, ArrowDownRight, Activity,
    Zap, Shield, MapPin, Clock
} from 'lucide-react'

const Dashboard = () => {
    const [stats, setStats] = useState({
        active_fleet: 0,
        maintenance_alerts: 0,
        utilization_rate: 0,
        pending_cargo: 0,
        total_vehicles: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8000/stats/dashboard-kpis', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                setStats(response.data)
            } catch (error) {
                console.error('Failed to fetch stats', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const data = [
        { name: '00:00', load: 45, energy: 32 },
        { name: '04:00', load: 52, energy: 45 },
        { name: '08:00', load: 85, energy: 78 },
        { name: '12:00', load: 78, energy: 82 },
        { name: '16:00', load: 92, energy: 88 },
        { name: '20:00', load: 65, energy: 72 },
        { name: '23:59', load: 48, energy: 40 },
    ]

    const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, delay }) => {
        // Map old dark colors to new light theme colors
        const colorMap = {
            'bg-quantum-blue': { bg: 'bg-brand-50', text: 'text-brand-500', border: 'border-brand-100' },
            'bg-quantum-amber': { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-100' },
            'bg-emerald-400': { bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-100' },
            'bg-indigo-400': { bg: 'bg-indigo-50', text: 'text-indigo-500', border: 'border-indigo-100' },
        }[color] || { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100' }

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay }}
                className="glass-card p-6 flex flex-col justify-between group"
            >
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-lg ${colorMap.bg} ${colorMap.text} ${colorMap.border} border`}>
                        <Icon size={22} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                    <div className="flex items-end justify-between mt-1">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>{trendValue}%</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500 font-medium">Real-time status of your global fleet assets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Active Deployment"
                    value={stats.active_fleet}
                    icon={Truck}
                    color="bg-quantum-blue"
                    trend="up"
                    trendValue="12.5"
                    delay={0.1}
                />
                <StatCard
                    title="Maintenance Pulse"
                    value={stats.maintenance_alerts}
                    icon={AlertCircle}
                    color="bg-quantum-amber"
                    trend="down"
                    trendValue="4.2"
                    delay={0.2}
                />
                <StatCard
                    title="Fleet Utilization"
                    value={`${stats.utilization_rate}%`}
                    icon={Zap}
                    color="bg-emerald-400"
                    trend="up"
                    trendValue="8.9"
                    delay={0.3}
                />
                <StatCard
                    title="Mission Queue"
                    value={stats.pending_cargo}
                    icon={Box}
                    color="bg-indigo-400"
                    trend="up"
                    trendValue="24.1"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="lg:col-span-2 glass-card p-6"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Deployment Density</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">Global 24h Telemetry</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-md border border-slate-200">
                            <button className="px-3 py-1 text-xs font-bold bg-white text-slate-800 rounded shadow-sm">Realtime</button>
                            <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Historical</button>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#26a394" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#26a394" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 600 }}
                                    labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="load" stroke="#26a394" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                                <Area type="monotone" dataKey="energy" stroke="#818cf8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorEnergy)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="glass-card p-6 flex flex-col"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Active Matrix</h3>

                    <div className="space-y-4 flex-1">
                        {[
                            { title: "Anomaly Detected", desc: "Vehicle-05 erratic odometer", color: "text-amber-500 bg-amber-50", icon: Shield },
                            { title: "Network Congestion", desc: "Origin Zone C at max capacity", color: "text-rose-500 bg-rose-50", icon: MapPin },
                            { title: "Sync Complete", desc: "All 12 assets responding", color: "text-emerald-500 bg-emerald-50", icon: Zap }
                        ].map((alert, i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                <div className={`p-2 rounded-lg ${alert.color}`}>
                                    <alert.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{alert.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{alert.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 w-full py-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        View Full Logs
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default Dashboard
