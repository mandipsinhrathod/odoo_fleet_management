import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Shield, Lock, Mail, ArrowRight, Zap, Target, Truck, Activity, User } from 'lucide-react'

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('Dispatcher') // Default role
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login, register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (isRegistering && password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsLoading(true)
        try {
            if (isRegistering) {
                // Execute registration flow
                await register(email, password, role)

                // Immediately login the user upon successful registration
                const success = await login(email, password)
                if (success) {
                    navigate('/')
                } else {
                    setError('Account created, but automatic login failed.')
                }
            } else {
                // Execute standard login flow
                const success = await login(email, password)
                if (success) {
                    navigate('/')
                } else {
                    setError('Invalid credentials access denied.')
                }
            }
        } catch (err) {
            setError(err.message || 'System authentication failure. Please retry.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Left Presentation Panel - Hidden on Mobile */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-16">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

                {/* Top Branding */}
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 text-white mb-2">
                        <img src="/fleetnova-logo-transparent.png" alt="Fleetnova Logo" className="w-20 object-contain" />
                        <h1 className="text-3xl font-black tracking-tight text-white">
                            Fleet<span className="text-accent-500">nova</span>
                        </h1>
                    </div>
                    <div className="w-12 h-1 bg-brand-500 rounded-full mt-4"></div>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 max-w-lg mt-12">
                    <h2 className="text-4xl font-black text-white leading-tight mb-6">
                        Enterprise Logistics <br />
                        <span className="text-brand-400">Command Center</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-12">
                        Streamline your entire fleet lifecycle. Monitor telemetry, predict maintenance, and optimize financial throughput with real-time intelligence.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: Activity, title: 'Real-time Telemetry', desc: 'Live GPS and diagnostic tracking.' },
                            { icon: Target, title: 'Intelligent Dispatch', desc: 'AI-assisted routing and load management.' },
                            { icon: Zap, title: 'Predictive Maintenance', desc: 'Proactive service alerts and logs.' }
                        ].map((feature, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 + 0.3 }}
                                key={i}
                                className="flex items-start space-x-4"
                            >
                                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                                    <feature.icon className="text-brand-400" size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{feature.title}</h4>
                                    <p className="text-slate-400 text-sm mt-0.5">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="relative z-10 flex items-center justify-between text-slate-500 text-sm mt-12 font-medium">
                    <span>&copy; 2026 Fleetnova Enterprise.</span>
                    <a href="#" className="hover:text-white transition-colors">Support Portal</a>
                </div>
            </div>

            {/* Right Login Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-white border-l border-slate-200">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-sm"
                >
                    {/* Mobile Branding (only visible on small screens) */}
                    <div className="flex flex-col items-center mb-12 lg:hidden">
                        <img src="/fleetnova-logo-transparent.png" alt="Fleetnova Logo" className="w-24 object-contain mb-4" />
                        <h1 className="text-3xl font-black tracking-tight text-brand-900">
                            Fleet<span className="text-accent-500">nova</span>
                        </h1>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                            {isRegistering ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {isRegistering ? 'Provision your new Fleetnova identity.' : 'Enter your credentials to access the control center.'}
                        </p>
                    </div>

                    {/* Toggle Auth Mode */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-8 border border-slate-200">
                        <button
                            type="button"
                            onClick={() => { setIsRegistering(false); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isRegistering ? 'bg-white shadow-sm text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsRegistering(true); setError(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isRegistering ? 'bg-white shadow-sm text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="group relative">
                                <label className="text-xs font-bold text-slate-700 ml-1 mb-2 block uppercase tracking-wide">Work Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 transition-all font-semibold shadow-sm"
                                        placeholder="admin@fleetnova.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {isRegistering && (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="group relative"
                                    >
                                        <label className="text-xs font-bold text-slate-700 ml-1 mb-2 block uppercase tracking-wide">Role Assignment</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                            </div>
                                            <select
                                                className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 appearance-none cursor-pointer transition-all font-semibold shadow-sm"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                required
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Dispatcher">Dispatcher</option>
                                                <option value="Driver">Driver</option>
                                                <option value="Analyst">Analyst</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}

                            <div className="group relative">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 block uppercase tracking-wide">Password</label>
                                    {!isRegistering && <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors">Forgot?</a>}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 transition-all font-semibold shadow-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {isRegistering && (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="group relative"
                                    >
                                        <label className="text-xs font-bold text-slate-700 ml-1 mb-2 block uppercase tracking-wide">Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 transition-all font-semibold shadow-sm"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-700 text-sm font-semibold text-center flex items-center justify-center space-x-2"
                                >
                                    <Shield size={16} className="text-rose-600" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="glow-button w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl disabled:opacity-70 text-lg shadow-lg shadow-brand-500/30"
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <ArrowRight size={20} strokeWidth={2.5} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm font-medium text-slate-500">
                        Protected by Fleetnova Security Protocols.
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Login
