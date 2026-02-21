import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Truck,
    Users,
    Navigation as DispatchIcon,
    Wrench,
    Fuel,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    User as UserIcon,
    Search
} from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import VehicleRegistry from './pages/VehicleRegistry'
import Drivers from './pages/Drivers'
import TripDispatcher from './pages/TripDispatcher'
import Maintenance from './pages/Maintenance'
import Financials from './pages/Financials'
import Analytics from './pages/Analytics'

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className={`premium-nav-item ${active ? 'bg-slate-800 text-white' : ''}`}>
        {active && <motion.div layoutId="nav-glow" className="nav-active-glow" />}
        <Icon size={20} className={active ? 'text-brand-400' : 'text-slate-400'} />
        <span className="font-medium tracking-wide">{label}</span>
    </Link>
)

const ProtectedLayout = ({ children }) => {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [isSidebarOpen, setSidebarOpen] = useState(true)

    if (!user) return <Navigate to="/login" replace />

    const navItems = [
        { to: "/", icon: LayoutDashboard, label: "Command Center" },
        { to: "/vehicles", icon: Truck, label: "Vehicle Registry" },
        { to: "/drivers", icon: Users, label: "Driver Network" },
        { to: "/dispatch", icon: DispatchIcon, label: "Trip Dispatcher" },
        { to: "/maintenance", icon: Wrench, label: "Health & Service" },
        { to: "/financials", icon: Fuel, label: "Financial Audit" },
        { to: "/analytics", icon: BarChart3, label: "Fleet Intelligence" },
    ]

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="glass-sidebar absolute sm:relative z-50 flex flex-col shrink-0 overflow-hidden text-white h-full shadow-2xl sm:shadow-none"
            >
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col"
                            >
                                <img src="/fleetnova-logo-transparent.png" alt="Fleetnova Logo" className="w-40 object-contain drop-shadow-sm" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={isSidebarOpen ? item.label : ""}
                            active={location.pathname === item.to}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <div className="bg-slate-800 rounded-2xl p-4 flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-brand-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/30">
                            {user.email[0].toUpperCase()}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-white">{user.email.split('@')[0]}</p>
                                <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest">{user.role}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={logout} className="flex items-center space-x-3 p-3 w-full rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all font-bold group">
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {isSidebarOpen && <span>Secure Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 relative z-40 shadow-sm">
                    {/* Mobile Sidebar Toggle (Shows only when sidebar closed on small screens) */}
                    <button onClick={() => setSidebarOpen(true)} className="sm:hidden p-2 -ml-2 mr-2 text-slate-400 hover:text-brand-600 rounded-xl transition-colors">
                        {!isSidebarOpen && <Menu size={24} />}
                    </button>
                    <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 flex-1 max-w-md group focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all mr-4">
                        <Search size={18} className="text-slate-400 group-focus-within:text-brand-500" />
                        <input
                            type="text"
                            placeholder="Search fleet assets..."
                            className="bg-transparent border-none focus:ring-0 outline-none text-sm ml-3 w-full text-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative p-2.5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status</p>
                                <p className="text-sm font-black text-emerald-600 flex items-center justify-end tracking-tight">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                    OPERATIONAL
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-8 pb-8 no-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="*"
                        element={
                            <ProtectedLayout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/vehicles" element={<VehicleRegistry />} />
                                    <Route path="/drivers" element={<Drivers />} />
                                    <Route path="/dispatch" element={<TripDispatcher />} />
                                    <Route path="/maintenance" element={<Maintenance />} />
                                    <Route path="/financials" element={<Financials />} />
                                    <Route path="/analytics" element={<Analytics />} />
                                </Routes>
                            </ProtectedLayout>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
