import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Search, Users, Shield, CreditCard,
    Calendar, CheckCircle2, AlertTriangle,
    XCircle, MoreVertical, Star, Activity,
    Mail, MapPin, Truck, Trash2
} from 'lucide-react'

const Drivers = () => {
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '', license_number: '', license_category: 'Truck', license_expiry: new Date().toISOString().split('T')[0]
    })

    useEffect(() => {
        fetchDrivers()
    }, [])

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/drivers/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setDrivers(response.data)
        } catch (error) {
            console.error('Failed to sync driver network', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:8000/drivers/', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setShowModal(false)
            fetchDrivers()
            setFormData({ name: '', license_number: '', license_category: 'Truck', license_expiry: new Date().toISOString().split('T')[0] })
        } catch (error) {
            alert('Failed to onboard operative.')
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm("Delete this operative?")) return
        try {
            await axios.delete(`http://localhost:8000/drivers/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchDrivers()
        } catch (error) {
            alert('Failed to delete driver.')
        }
    }

    const getComplianceStatus = (expiryDate) => {
        const today = new Date()
        const expiry = new Date(expiryDate)
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { label: 'CRITICAL: EXPIRED', color: 'text-rose-700 bg-rose-50 border-rose-200', icon: XCircle }
        if (diffDays < 30) return { label: 'WARNING: NEAR EXPIRY', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle }
        return { label: 'LICENSE SECURE', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'On Duty': return 'bg-emerald-500'
            case 'Off Duty': return 'bg-slate-400'
            case 'On Trip': return 'bg-brand-500 shadow-sm shadow-brand-500/50'
            case 'Suspended': return 'bg-rose-500'
            default: return 'bg-slate-400'
        }
    }

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.license_number.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center">
                        <Users className="mr-3 text-brand-500" size={32} />
                        Driver Network
                    </h1>
                    <p className="text-slate-500 font-medium ml-1">Digital identity and compliance management for fleet operatives.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or UID..."
                            className="bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 w-64 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="glow-button flex items-center space-x-2 shadow-md shadow-brand-500/20"
                    >
                        <Plus size={20} />
                        <span>Onboard Operative</span>
                    </button>
                </div>
            </div>

            {/* Content Table Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Driver Identity</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Compliance Risk</th>
                                <th className="px-6 py-4 text-right">Safety Score</th>
                                <th className="px-6 py-4 text-center">Asset Class</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence>
                                {filteredDrivers.map((driver, idx) => {
                                    const compliance = getComplianceStatus(driver.license_expiry)
                                    return (
                                        <motion.tr
                                            key={driver.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-slate-50 group transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 p-0.5">
                                                        <div className="w-full h-full rounded-md bg-white flex items-center justify-center font-black text-sm text-brand-600 shadow-sm">
                                                            {driver.name[0]}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{driver.name}</p>
                                                        <p className="text-xs text-slate-500 font-mono tracking-wide">ID: {driver.license_number.substring(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider border border-slate-200 flex items-center justify-center w-max mx-auto`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusStyle(driver.status)}`} />
                                                    {driver.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border flex items-center w-max ${compliance.color}`}>
                                                    <compliance.icon size={12} className="mr-1.5" />
                                                    {compliance.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-bold text-slate-800">{driver.safety_score.toFixed(1)}</span> <span className="text-xs text-slate-400 font-semibold">%</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="px-2.5 py-1 rounded border border-indigo-100 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                                                    {driver.license_category || 'Class B'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={(e) => handleDelete(e, driver.id)} className="p-1.5 text-rose-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center p-20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-4 border-slate-200 border-t-brand-500 rounded-full"
                    />
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative shadow-2xl border border-slate-200"
                    >
                        <div className="mb-8 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Onboard Operative</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-lg transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">License No (UID)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium font-mono uppercase"
                                        value={formData.license_number}
                                        onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Asset Class</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium appearance-none cursor-pointer"
                                        value={formData.license_category}
                                        onChange={(e) => setFormData({ ...formData, license_category: e.target.value })}
                                    >
                                        <option value="Truck">Heavy Duty Truck</option>
                                        <option value="Van">Logistics Van</option>
                                        <option value="Bike">Micro-Courier</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">License Expiry</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                                        value={formData.license_expiry}
                                        onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full glow-button py-3.5 mt-2 font-bold shadow-md shadow-brand-500/20">Authorize Operative</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

const X = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>

export default Drivers
