import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Fuel, IndianRupee, Wallet, CreditCard,
    ArrowUpRight, ArrowDownRight, Zap,
    Activity, Plus, Search, Droplets,
    Filter, Download, PieChart, TrendingUp, Trash2
} from 'lucide-react'

const Financials = () => {
    const [fuelLogs, setFuelLogs] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const [fuelData, setFuelData] = useState({
        vehicle_id: '',
        liters: '',
        cost: '',
        date: new Date().toISOString().split('T')[0],
        odometer_reading: ''
    })

    useEffect(() => {
        fetchFinancials()
    }, [])

    const fetchFinancials = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            const [fuelRes, vehiclesRes] = await Promise.all([
                axios.get('http://localhost:8000/fuel/', config),
                axios.get('http://localhost:8000/vehicles/', config)
            ])
            setFuelLogs(fuelRes.data.reverse())
            setVehicles(vehiclesRes.data)
        } catch (error) {
            console.error('Fiscal sync failure', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFuelSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:8000/fuel/', fuelData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setShowModal(false)
            fetchFinancials()
        } catch (error) {
            alert("Transaction commit failed.")
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm("Delete this fuel log?")) return
        try {
            await axios.delete(`http://localhost:8000/fuel/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchFinancials()
        } catch (error) {
            alert('Failed to delete fuel log.')
        }
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center">
                        <Wallet className="mr-3 text-emerald-500" size={32} />
                        Financial Overview
                    </h1>
                    <p className="text-slate-500 font-medium ml-1">Clear transparency of operational expenditure and fuel efficiency.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="glow-button flex items-center space-x-2 bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600"
                >
                    <Droplets size={20} />
                    <span>Record Fuel Log</span>
                </button>
            </div>

            {/* Financial Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: "Gross Fuel Burn", value: `₹${fuelLogs.reduce((acc, l) => acc + l.cost, 0).toLocaleString()}`, trend: "+2.4%", trendColor: "text-rose-600 bg-rose-50 border-rose-200", icon: Fuel, color: "text-brand-500" },
                    { label: "Efficiency Index", value: "8.2", sub: "km/L avg", trend: "+5.1%", trendColor: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: Zap, color: "text-emerald-500" },
                    { label: "Maintenance Escrow", value: "₹12,450", trend: "-1.2%", trendColor: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: IndianRupee, color: "text-amber-500" },
                    { label: "Active Budget", value: "92%", sub: "Utilization", trend: "0.0%", trendColor: "text-slate-600 bg-slate-100 border-slate-200", icon: Activity, color: "text-indigo-500" }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-brand-200 transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100 ${item.color}`}>
                                <item.icon size={22} strokeWidth={2.5} />
                            </div>
                            <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md border ${item.trendColor}`}>
                                {item.trend}
                            </span>
                        </div>
                        <div className="mt-5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">{item.value}</p>
                            {item.sub && <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">{item.sub}</p>}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Fuel Log Ledger */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                            <TrendingUp className="mr-3 text-brand-500" size={24} />
                            Fuel Ledger
                        </h3>
                        <button className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
                            <Download size={18} />
                        </button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-3.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Vehicle ID</th>
                                    <th className="px-6 py-3.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Volume (L)</th>
                                    <th className="px-6 py-3.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Cost</th>
                                    <th className="px-6 py-3.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {fuelLogs.map((log, idx) => (
                                    <motion.tr
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="hover:bg-slate-50 transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 tracking-tight">Vehicle {log.vehicle_id}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{log.liters} L</td>
                                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{log.cost.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-xs font-semibold text-slate-500">
                                            <div className="flex items-center justify-end space-x-4">
                                                <span>{log.date}</span>
                                                <button onClick={(e) => handleDelete(e, log.id)} className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Budget Visualizer Placeholder */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col justify-center items-center text-center space-y-8">
                    <div className="w-48 h-48 rounded-full border-[16px] border-slate-50 flex items-center justify-center relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-[16px] border-t-emerald-500 border-r-brand-500 border-b-transparent border-l-transparent rounded-full opacity-80"
                        />
                        <div className="text-center z-10">
                            <p className="text-4xl font-black text-slate-900 tracking-tight">84%</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Efficiency</p>
                        </div>
                    </div>
                    <div className="max-w-xs">
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Resource Analysis</h4>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Systems indicate optimal throughput with minimal fiscal variance across all active sectors.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-slate-100">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sector ROI</p>
                            <p className="text-lg font-black text-emerald-600">+12.5%</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Network Drift</p>
                            <p className="text-lg font-black text-brand-600">0.04ms</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal - Fuel Entry */}
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
                                    <Fuel className="mr-3 text-emerald-500" size={24} />
                                    Record Fuel Log
                                </h2>
                            </div>
                            <form onSubmit={handleFuelSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Vehicle</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold appearance-none cursor-pointer focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                            value={fuelData.vehicle_id}
                                            onChange={(e) => setFuelData({ ...fuelData, vehicle_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Vehicle...</option>
                                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Fuel Added (Liters)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                            placeholder="0.00"
                                            value={fuelData.liters}
                                            onChange={(e) => setFuelData({ ...fuelData, liters: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Total Cost ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                            placeholder="0.00"
                                            value={fuelData.cost}
                                            onChange={(e) => setFuelData({ ...fuelData, cost: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Odometer Reading</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                            placeholder="0000.0"
                                            value={fuelData.odometer_reading}
                                            onChange={(e) => setFuelData({ ...fuelData, odometer_reading: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">Cancel</button>
                                    <button type="submit" className="flex-[2] py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">Confirm Fuel Entry</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Financials
