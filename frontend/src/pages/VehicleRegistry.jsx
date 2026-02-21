import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Search, Truck, MapPin, Activity,
    MoreVertical, Edit3, Trash2, Filter,
    ChevronRight, ArrowUpDown, Zap, Shield, Box
} from 'lucide-react'

const VehicleRegistry = () => {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '', plate: '', vehicle_type: 'Truck', capacity: '', odometer: '', acquisition_cost: '0'
    })

    useEffect(() => {
        fetchVehicles()
    }, [])

    const fetchVehicles = async () => {
        try {
            const response = await axios.get('http://localhost:8000/vehicles/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setVehicles(response.data)
        } catch (error) {
            console.error('Failed to fetch vehicles', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                capacity: parseFloat(formData.capacity) || 0,
                odometer: parseFloat(formData.odometer) || 0,
                acquisition_cost: parseFloat(formData.acquisition_cost) || 0
            }
            await axios.post('http://localhost:8000/vehicles/', payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setShowModal(false)
            fetchVehicles()
            setFormData({ name: '', plate: '', vehicle_type: 'Truck', capacity: '', odometer: '', acquisition_cost: '0' })
        } catch (error) {
            alert('Operation failed. Check telemetry systems.')
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm("Delete this vehicle?")) return
        try {
            await axios.delete(`http://localhost:8000/vehicles/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchVehicles()
        } catch (error) {
            alert('Failed to delete vehicle.')
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
            case 'On Trip': return 'text-brand-700 bg-brand-50 border-brand-200';
            case 'In Shop': return 'text-amber-700 bg-amber-50 border-amber-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    }

    const filteredVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center">
                        <Truck className="mr-3 text-brand-500" size={32} />
                        Asset Inventory
                    </h1>
                    <p className="text-slate-500 font-medium ml-1">Comprehensive tracking of mobile logistics infrastructure.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="glow-button flex items-center space-x-2 shadow-md shadow-brand-500/20"
                >
                    <Plus size={20} />
                    <span>Register New Asset</span>
                </button>
            </div >

            {/* Quick Stats Bar */}
            < div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
                {
                    [
                        { label: "Total Fleet Capacity", value: `${vehicles.reduce((acc, v) => acc + v.capacity, 0).toLocaleString()} KG`, icon: Box, color: "text-brand-500 bg-brand-50" },
                        { label: "Active Nodes", value: vehicles.filter(v => v.status === 'On Trip').length, icon: Activity, color: "text-emerald-600 bg-emerald-50" },
                        { label: "Maintenance Alerts", value: vehicles.filter(v => v.status === 'In Shop').length, icon: Shield, color: "text-amber-500 bg-amber-50" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                    ))
                }
            </div >

            {/* Content Table Area */}
            < div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" >
                {/* Table Header / Filters */}
                < div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between" >
                    <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-80 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                        <Search size={18} className="text-slate-400 focus-within:text-brand-500" />
                        <input
                            type="text"
                            placeholder="Filter by Name or Plate..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div >

                {/* The Table */}
                < div className="overflow-x-auto" >
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Asset Identity</th>
                                <th className="px-6 py-4 text-center">Class</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Payload Limit</th>
                                <th className="px-6 py-4 text-right">Odometer (km)</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredVehicles.map((vehicle, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={vehicle.id}
                                    className="hover:bg-slate-50 group transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center border border-brand-100">
                                                <Truck size={18} className="text-brand-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{vehicle.name}</p>
                                                <p className="text-xs text-slate-500 font-mono tracking-wide">{vehicle.plate}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                            {vehicle.vehicle_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${getStatusColor(vehicle.status)}`}>
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                                        {vehicle.capacity.toLocaleString()} <span className="text-xs text-slate-400 ml-1 font-semibold">KG</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-500">
                                        {vehicle.odometer.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={(e) => handleDelete(e, vehicle.id)} className="p-1.5 text-rose-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div >
            </div >

            {/* Modal - Simplified & Themed */}
            {
                showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative shadow-2xl border border-slate-200"
                        >
                            <div className="mb-8 flex justify-between items-center">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Register New Asset</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-lg transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Display Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 ml-1">License Plate</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium font-mono uppercase"
                                            value={formData.plate}
                                            onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Vehicle Class</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium appearance-none cursor-pointer"
                                            value={formData.vehicle_type}
                                            onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                        >
                                            <option value="Truck">Heavy Duty Truck</option>
                                            <option value="Van">Logistics Van</option>
                                            <option value="Bike">Micro-Courier</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 ml-1">Payload (KG)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium relative z-50"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full glow-button py-3.5 mt-2 font-bold shadow-md shadow-brand-500/20">Register to System</button>
                            </form>
                        </motion.div>
                    </div>
                )
            }
        </div >
    )
}

const X = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>

export default VehicleRegistry
