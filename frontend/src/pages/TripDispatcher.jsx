import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Navigation, MapPin, Truck, User, Weight,
    Calendar, Clock, CheckCircle2, Play,
    XCircle, AlertCircle, ArrowRight, Zap,
    Shield, Activity, Trash2
} from 'lucide-react'

const TripDispatcher = () => {
    const [trips, setTrips] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        vehicle_id: '',
        driver_id: '',
        cargo_weight: '',
        origin: '',
        destination: ''
    })
    const [errors, setErrors] = useState({})

    // Google map states
    const [mapInstance, setMapInstance] = useState(null)
    const [directionsRenderer, setDirectionsRenderer] = useState(null)

    useEffect(() => {
        fetchInitialData()
    }, [])

    // Initialize map on mount if google is available
    useEffect(() => {
        const initMap = () => {
            if (!window.google) {
                // Wait for the script to load lazily
                setTimeout(initMap, 500);
                return;
            }
            if (!document.getElementById("dispatch-map") || mapInstance) return;

            const map = new window.google.maps.Map(document.getElementById("dispatch-map"), {
                center: { lat: 40.7128, lng: -74.0060 }, // Default NYC
                zoom: 11,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            });

            const renderer = new window.google.maps.DirectionsRenderer({
                map: map,
                polylineOptions: {
                    strokeColor: "#0ea5e9", // brand-500
                    strokeWeight: 4
                }
            });

            setMapInstance(map);
            setDirectionsRenderer(renderer);
        };
        initMap();
    }, []);

    const displayRoute = (routeOrigin, routeDestination) => {
        if (!window.google || !directionsRenderer) {
            alert("Map infrastructure is still loading. Please wait.");
            return;
        }

        console.log(`Requesting route from ${routeOrigin} to ${routeDestination}...`);
        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: routeOrigin,
                destination: routeDestination,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error("Google Maps API Error:", status);
                    alert(`Routing Request Failed.\n\nGoogle API Status: ${status}\n\nPlease ensure your API Key has the "Directions API" enabled in your Google Cloud Console, and that billing is active.`);
                    directionsRenderer.setDirections({ routes: [] });
                }
            }
        );
    };

    // Calculate directions when forms change (with debounce)
    useEffect(() => {
        if (!window.google || !directionsRenderer) return;

        const timeoutId = setTimeout(() => {
            if (formData.origin && formData.destination && formData.origin.length > 2 && formData.destination.length > 2) {
                displayRoute(formData.origin, formData.destination);
            } else {
                directionsRenderer.setDirections({ routes: [] });
            }
        }, 1200); // Wait for user to stop typing

        return () => clearTimeout(timeoutId);
    }, [formData.origin, formData.destination, directionsRenderer]);

    const fetchInitialData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
                axios.get('http://localhost:8000/trips/', config),
                axios.get('http://localhost:8000/vehicles/', config),
                axios.get('http://localhost:8000/drivers/', config)
            ])
            setTrips(tripsRes.data.reverse())
            setVehicles(vehiclesRes.data)
            setDrivers(driversRes.data)
        } catch (error) {
            console.error('Failed to sync mission data', error)
        } finally {
            setLoading(false)
        }
    }

    const validateMission = () => {
        const newErrors = {}
        const vehicle = vehicles.find(v => v.id === parseInt(formData.vehicle_id))
        const driver = drivers.find(d => d.id === parseInt(formData.driver_id))

        if (vehicle && formData.cargo_weight > vehicle.capacity) {
            newErrors.cargo_weight = `Payload violation: ${formData.cargo_weight}kg exceeds ${vehicle.capacity}kg limit`
        }
        if (driver && new Date(driver.license_expiry) < new Date()) {
            newErrors.driver_id = "Compliance block: Driver license expired."
        }
        if (vehicle && vehicle.status !== 'Available') {
            newErrors.vehicle_id = `Asset locked: Current state is ${vehicle.status}`
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleLaunchMission = async (e) => {
        e.preventDefault()
        if (!validateMission()) return

        try {
            await axios.post('http://localhost:8000/trips/', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setFormData({ vehicle_id: '', driver_id: '', cargo_weight: '', origin: '', destination: '' })
            fetchInitialData()
        } catch (error) {
            alert(error.response?.data?.detail || "Mission launch aborted.")
        }
    }

    const handleCompleteMission = async (tripId) => {
        try {
            await axios.patch(`http://localhost:8000/trips/${tripId}/complete?final_odometer=0`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchInitialData()
        } catch (error) {
            alert("Protocol failure: Unable to mark mission complete.")
        }
    }

    const handleDeleteMission = async (tripId) => {
        if (!window.confirm("Abort this mission?")) return
        try {
            await axios.delete(`http://localhost:8000/trips/${tripId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchInitialData()
        } catch (error) {
            alert("Failed to abort mission.")
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Draft': return 'border-slate-200 text-slate-600 bg-slate-50'
            case 'Dispatched': return 'border-brand-200 text-brand-700 bg-brand-50'
            case 'Completed': return 'border-emerald-200 text-emerald-700 bg-emerald-50'
            case 'Cancelled': return 'border-rose-200 text-rose-700 bg-rose-50'
            default: return 'border-slate-200 text-slate-700 bg-slate-50'
        }
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12 animate-in fade-in duration-500">
            {/* Left: Mission Operations (Form) */}
            <div className="xl:col-span-1 space-y-6">
                <div className="flex flex-col space-y-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Dispatch Unit</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Create Mission Profile</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"
                >
                    <form onSubmit={handleLaunchMission} className="space-y-6 relative z-10">
                        <section className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 ml-1">Assign Asset</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-semibold appearance-none cursor-pointer"
                                    value={formData.vehicle_id}
                                    onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Vehicle...</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id} disabled={v.status !== 'Available'}>
                                            {v.name} ({v.plate}) - {v.status}
                                        </option>
                                    ))}
                                </select>
                                {errors.vehicle_id && <p className="text-xs text-rose-600 font-bold ml-1">{errors.vehicle_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 ml-1">Assign Operative</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-semibold appearance-none cursor-pointer"
                                    value={formData.driver_id}
                                    onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Driver...</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id} disabled={d.status !== 'On Duty'}>
                                            {d.name} ({d.status})
                                        </option>
                                    ))}
                                </select>
                                {errors.driver_id && <p className="text-xs text-rose-600 font-bold ml-1">{errors.driver_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 ml-1">Payload Mass (KG)</label>
                                <div className="relative">
                                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-semibold"
                                        value={formData.cargo_weight}
                                        onChange={(e) => setFormData({ ...formData, cargo_weight: e.target.value })}
                                        required
                                    />
                                </div>
                                {errors.cargo_weight && <p className="text-xs text-rose-600 font-bold ml-1">{errors.cargo_weight}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Origin</label>
                                    <input
                                        type="text"
                                        placeholder="Location A"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-semibold"
                                        value={formData.origin}
                                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 ml-1">Destination</label>
                                    <input
                                        type="text"
                                        placeholder="Location B"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 font-semibold"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <button type="submit" className="w-full glow-button flex items-center justify-center space-x-2 py-4 shadow-md shadow-brand-500/20">
                            <span className="text-sm font-bold">Dispatch Mission</span>
                        </button>
                    </form>
                </motion.div>
            </div>

            {/* Right: Active Missions (List & Map) */}
            <div className="xl:col-span-2 space-y-6">

                {/* Embedded Live Map Display */}
                <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
                    <div className="flex items-center space-x-2 px-4 py-3 mb-1">
                        <MapPin size={18} className="text-brand-500" />
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Routing Intelligence</h3>
                    </div>
                    <div id="dispatch-map" className="w-full h-[350px] rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                        {/* Google map binds here */}
                    </div>
                </div>

                <div className="flex justify-between items-end mt-8">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">Active Telemetry</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Fleet Status</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {trips.length === 0 ? (
                            <div className="bg-slate-50 p-16 rounded-2xl text-center border-2 border-dashed border-slate-200">
                                <Activity size={40} className="mx-auto text-slate-400 mb-3" />
                                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">No active dispatches.</p>
                            </div>
                        ) : (
                            trips.map((trip, idx) => (
                                <motion.div
                                    key={trip.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="flex items-center space-x-5">
                                        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-100">
                                            <Truck size={24} className="text-brand-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <h4 className="text-lg font-bold text-slate-900 tracking-tight">TRP-{trip.id.toString().padStart(4, '0')}</h4>
                                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(trip.status)}`}>
                                                    {trip.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                                                <span className="flex items-center"><User size={12} className="mr-1" /> {trip.driver?.name}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="flex items-center"><Weight size={12} className="mr-1" /> {trip.cargo_weight}KG</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between xl:justify-end gap-6 flex-1 max-w-md bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <div className="flex-1 flex items-center justify-between px-2">
                                            <div className="text-left">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Origin</p>
                                                <p className="text-sm font-bold text-slate-800">{trip.origin}</p>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-400 mx-3" />
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Destination</p>
                                                <p className="text-sm font-bold text-slate-800">{trip.destination}</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 ml-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    displayRoute(trip.origin, trip.destination);
                                                    document.getElementById('dispatch-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }}
                                                className="p-3 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                                title="View Route"
                                            >
                                                <Navigation size={20} />
                                            </button>

                                            {trip.status === 'Dispatched' && (
                                                <button
                                                    onClick={() => handleCompleteMission(trip.id)}
                                                    className="p-3 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white transition-all"
                                                >
                                                    <CheckCircle2 size={20} />
                                                </button>
                                            )}
                                            {trip.status === 'Completed' && (
                                                <div className="p-3 text-emerald-500">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => handleDeleteMission(trip.id)}
                                                className="p-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default TripDispatcher
