import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

const ContractorRegister = () => {
    // 1. Initialize Inertia Form Hook
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        trade: '',
        years_of_experience: '',
    });

    // 2. Handle Form Submission
    const submit = (e) => {
        e.preventDefault();
        post(route('contractor.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="bg-[#f8f9fa] text-[#191c1d] font-sans min-h-screen overflow-x-hidden">
            <Head title="Contractor Registration | RepairLink" />

            {/* Top Navigation */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/15 shadow-sm">
                <div className="flex items-center justify-between px-6 h-16 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="material-symbols-outlined text-[#003f87] active:scale-95 transition-transform">
                            arrow_back
                        </Link>
                        <h1 className="font-bold text-lg tracking-tight text-[#003f87]">Contractor Portal</h1>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-sm font-medium text-slate-500 hover:text-[#0056b3] transition-colors cursor-pointer">Help</span>
                        <span className="text-sm font-medium text-slate-500 hover:text-[#0056b3] transition-colors cursor-pointer">Terms</span>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-32 px-4 flex justify-center items-start min-h-screen">
                <div className="w-full max-w-[500px] bg-white rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-200/15">
                    
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Register as a Contractor</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Fill in your details to join the platform. Your account will be reviewed by admin.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Field: Name */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500 ml-1">Name</label>
                            <input 
                                className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-[#003f87] focus:bg-white focus:ring-0 transition-all px-4 py-3 rounded-t-lg outline-none"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Full Name"
                                required
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        {/* Field: Email */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500 ml-1">Email</label>
                            <input 
                                className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-[#003f87] focus:bg-white focus:ring-0 transition-all px-4 py-3 rounded-t-lg outline-none"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                required
                            />
                            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                        </div>

                        {/* Passwords Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500 ml-1">Password</label>
                                <input 
                                    className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-[#003f87] focus:bg-white focus:ring-0 transition-all px-4 py-3 rounded-t-lg outline-none"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500 ml-1">Confirm Password</label>
                                <input 
                                    className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-[#003f87] focus:bg-white focus:ring-0 transition-all px-4 py-3 rounded-t-lg outline-none"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Field: Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500 ml-1">Phone</label>
                            <input 
                                className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-[#003f87] focus:bg-white focus:ring-0 transition-all px-4 py-3 rounded-t-lg outline-none"
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+254..."
                                required
                            />
                        </div>

                        {/* Field: Trade */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500 ml-1">Trade</label>
                            <select 
                                className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-[#003f87] focus:bg-white focus:ring-0 transition-all px-4 py-3 rounded-t-lg outline-none"
                                value={data.trade}
                                onChange={(e) => setData('trade', e.target.value)}
                                required
                            >
                                <option value="">Select a trade...</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="electrical">Electrical</option>
                                <option value="carpentry">Carpentry</option>
                                <option value="painting">Painting</option>
                            </select>
                        </div>

                        {/* Field: Experience */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500 ml-1">Years of Experience</label>
                            <input 
                                className="w-full bg-gray-50 border-b-2 border-gray-300 focus:border-[#003f87] focus:bg-white focus:ring-0 transition-all px-4 py-3 rounded-t-lg outline-none"
                                type="number"
                                min="0"
                                value={data.years_of_experience}
                                onChange={(e) => setData('years_of_experience', e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-6">
                            <button 
                                className="w-full bg-gradient-to-r from-[#003f87] to-[#0056b3] text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Registering...' : 'Register Contractor'}
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">
                            By registering, you agree to our <span className="text-[#003f87] font-medium hover:underline cursor-pointer">Service Terms</span> and <span className="text-[#003f87] font-medium hover:underline cursor-pointer">Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContractorRegister;