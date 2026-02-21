import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wrench, Calendar, IndianRupee,
    CheckCircle2, Clock, Truck, Plus,
    Search, Shield, Activity, AlertCircle,
    BarChart3, Settings, ClipboardList, Trash2
} from 'lucide-react'

const Maintenance = () => {
    const [logs, setLogs] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        vehicle_id: '',
        service_type: 'Preventative',
        description: '',
        cost: '',
        service_date: new Date().toISOString().split('T')[0],
        next_due_date: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            const [logsRes, vehiclesRes] = await Promise.all([
                axios.get('http://localhost:8000/maintenance/', config),
                axios.get('http://localhost:8000/vehicles/', config)
            ])
            setLogs(logsRes.data.reverse())
            setVehicles(vehiclesRes.data)
        } catch (error) {
            console.error('Telemetry failure', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:8000/maintenance/', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setShowModal(false)
            fetchData()
        } catch (error) {
            alert("Submission error in health logs.")
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm("Delete this maintenance record?")) return
        try {
            await axios.delete(`http://localhost:8000/maintenance/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchData()
        } catch (error) {
            alert('Failed to delete maintenance log.')
        }
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center">
                        <Wrench className="mr-3 text-brand-500" size={32} />
                        Fleet Maintenance
                    </h1>
                    <p className="text-slate-500 font-medium ml-1">Fleet longevity and prognostic maintenance tracking.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="glow-button flex items-center space-x-2 shadow-md shadow-brand-500/20"
                >
                    <Plus size={20} />
                    <span>Report Service Event</span>
                </button>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Fleet Health Index", value: "94%", detail: "Optimized", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Service Velocity", value: "2.4d", detail: "Turnaround", color: "text-brand-500", bg: "bg-brand-50" },
                    { label: "Active Shop Nodes", value: vehicles.filter(v => v.status === 'In Shop').length, detail: "In Repair", color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Fiscal Impact", value: `₹${logs.reduce((acc, l) => acc + l.cost, 0).toLocaleString()}`, detail: "Total Spend", color: "text-indigo-500", bg: "bg-indigo-50" }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                {i === 0 && <Shield size={22} strokeWidth={2.5} />}
                                {i === 1 && <Activity size={22} strokeWidth={2.5} />}
                                {i === 2 && <Wrench size={22} strokeWidth={2.5} />}
                                {i === 3 && <IndianRupee size={22} strokeWidth={2.5} />}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${stat.color.replace('text-', 'bg-')}`} />
                            {stat.detail}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Service Feed */}
                <div className="xl:col-span-2 space-y-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                        <ClipboardList className="mr-2 text-slate-400" size={24} />
                        Service History
                    </h3>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {logs.map((log, idx) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center space-x-5">
                                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center font-bold text-amber-500">
                                            <Wrench size={22} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 tracking-tight">Vehicle {log.vehicle_id}</p>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{log.service_type} - {log.service_date}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 mx-8 border-l border-slate-100 pl-8">
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic line-clamp-2">{log.description}</p>
                                    </div>

                                    <div className="flex items-center space-x-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Cost</p>
                                            <p className="text-lg font-black text-slate-900 tracking-tight">₹{log.cost.toLocaleString()}</p>
                                        </div>
                                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100">
                                                <BarChart3 size={18} className="text-slate-500" />
                                            </div>
                                            <button onClick={(e) => handleDelete(e, log.id)} className="p-2.5 bg-rose-50 rounded-lg border border-rose-100 cursor-pointer hover:bg-rose-100 text-rose-500">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Prognostics / Due Dates */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                        <Calendar className="mr-2 text-rose-500" size={24} />
                        Upcoming Maintenance
                    </h3>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                        {logs.slice(0, 4).map((log, i) => (
                            <div key={i} className="relative pl-5 border-l-2 border-slate-100 group">
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-rose-500 group-hover:scale-150 transition-transform shadow-sm" />
                                <div>
                                    <p className="text-xs font-bold text-slate-900 tracking-tight">Due: {log.next_due_date || 'N/A'}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 tracking-wider">Vehicle {log.vehicle_id} · Scheduled Service</p>
                                </div>
                            </div>
                        ))}

                        <button className="w-full py-3 mt-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm">
                            View Full Schedule
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal - Simplified & Themed */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative shadow-2xl border border-slate-200"
                        >
                            <div className="mb-8 flex justify-between items-center bg-slate-50 -mx-8 -mt-8 px-8 py-5 border-b border-slate-200 rounded-t-2xl">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                                    <Settings className="mr-2 text-brand-500" size={22} />
                                    Record Maintenance
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Vehicle</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold appearance-none cursor-pointer focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                            value={formData.vehicle_id}
                                            onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Asset...</option>
                                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Service Type</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold appearance-none cursor-pointer focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                            value={formData.service_type}
                                            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                        >
                                            <option value="Preventative">Preventative</option>
                                            <option value="Repair">Repair</option>
                                            <option value="Inspection">Inspection</option>
                                            <option value="Emergency">Emergency</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Service Description</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold h-28 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                                        placeholder="Briefly describe the maintenance performed..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Service Cost ($)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                            placeholder="0.00"
                                            value={formData.cost}
                                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Next Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                            value={formData.next_due_date}
                                            onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-3.5 mt-2 rounded-xl bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-500/20 hover:bg-brand-600 hover:shadow-lg transition-all">Submit Maintenance Record</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

const X = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>

export default Maintenance
