import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

// Universal Icon Wrapper
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined ${className}`}>
        {name}
    </span>
);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans antialiased">
            <Head title="Contractor Registration | RepairLink" />

            {/* ─── LEFT SIDE: PREMIUM SPLIT-SCREEN BRAND PANEL ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* Decorative background vectors for production style enhancement */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                
                {/* Logo Section */}
                <div className="relative z-10 flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-white text-3xl font-bold">handshake</span>
                    <span className="font-black text-2xl tracking-wider">RepairLink</span>
                </div>

                {/* Central Focus Context */}
                <div className="relative z-10 max-w-md my-auto space-y-4">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                        Connecting You with Skilled Hands, Every Step of the Way.
                    </h2>
                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium opacity-90">
                        Join our trusted trade network to access localized residential repair tickets, submit transparent price quotes, and manage your active project pipeline.
                    </p>
                </div>

                {/* Secure Gateway Footer Token */}
                <div className="relative z-10 text-xs text-blue-200/80 flex items-center gap-2 font-medium">
                    <Icon name="verified_user" className="text-sm text-blue-300" />
                    <span>Protected by end-to-end authentication layer policies.</span>
                </div>
            </div>

            {/* ─── RIGHT SIDE: CLEAN FORM INPUT CARD HUB ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-900 overflow-y-auto">
                <div className="w-full max-w-md space-y-6 py-8">
                    
                    {/* Header Headers & Mobile Back Navigation Row */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                                <Icon name="arrow_back" className="text-sm" /> Back to Home
                            </Link>
                            <div className="flex lg:hidden items-center gap-1.5">
                                <span className="material-symbols-outlined text-blue-600 text-2xl font-bold">handshake</span>
                                <span className="font-black text-xl text-gray-900 dark:text-white tracking-wider">RepairLink</span>
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Contractor Registration
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Submit your trade credentials to join our approved specialist network.
                        </p>
                    </div>

                    {/* Content Registration Form */}
                    <form onSubmit={submit} className="space-y-4">
                        
                        {/* 1. Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-0.5">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="person" className="text-lg" />
                                </div>
                                <input 
                                    className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-sm"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            {errors.name && <div className="text-red-500 text-xs mt-1">⚠️ {errors.name}</div>}
                        </div>

                        {/* 2. Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-0.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="mail" className="text-lg" />
                                </div>
                                <input 
                                    className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-sm"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            {errors.email && <div className="text-red-500 text-xs mt-1">⚠️ {errors.email}</div>}
                        </div>

                        {/* 3. Phone Number Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-0.5">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="phone" className="text-lg" />
                                </div>
                                <input 
                                    className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-sm"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="07XXXXXXXX"
                                    required
                                />
                            </div>
                            {errors.phone && <div className="text-red-500 text-xs mt-1">⚠️ {errors.phone}</div>}
                        </div>

                        {/* 4. Passwords Two-Column Grid Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-0.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                        <Icon name="lock" className="text-lg" />
                                    </div>
                                    <input 
                                        className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-sm"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-0.5">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                        <Icon name="lock_clock" className="text-lg" />
                                    </div>
                                    <input 
                                        className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-sm"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            {errors.password && <div className="text-red-500 text-xs mt-1 col-span-full">⚠️ {errors.password}</div>}
                        </div>

                        {/* 5. Trade Specialty Selection Row */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-0.5">Trade Specialization</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="construction" className="text-lg" />
                                </div>
                                <select 
                                    className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-sm appearance-none cursor-pointer"
                                    value={data.trade}
                                    onChange={(e) => setData('trade', e.target.value)}
                                    required
                                >
                                    <option value="">Select your craft...</option>
                                    <option value="carpentry">Carpentry & Woodwork</option>
                                    <option value="plumbing">Plumbing Maintenance</option>
                                    <option value="electrical">Electrical Grid & Systems</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                    <Icon name="arrow_drop_down" className="text-xl" />
                                </div>
                            </div>
                            {errors.trade && <div className="text-red-500 text-xs mt-1">⚠️ {errors.trade}</div>}
                        </div>

                        {/* 6. Years of Experience Numeric Field Row */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-0.5">Years of Experience</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="history_edu" className="text-lg" />
                                </div>
                                <input 
                                    className="w-full pl-10 pr-3 py-3 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-sm"
                                    type="number"
                                    min="0"
                                    value={data.years_of_experience}
                                    onChange={(e) => setData('years_of_experience', e.target.value)}
                                    placeholder="e.g., 3"
                                    required
                                />
                            </div>
                            {errors.years_of_experience && <div className="text-red-500 text-xs mt-1">⚠️ {errors.years_of_experience}</div>}
                        </div>

                        {/* 7. Action Submit Button Toggle Group */}
                        <div className="pt-2">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 group"
                            >
                                {processing ? 'Registering Account...' : 'Register Contractor Node'}
                                {!processing && <Icon name="badge" className="text-sm group-hover:translate-x-0.5 transition-transform" />}
                            </button>
                        </div>
                    </form>

                    {/* 8. Redirect Policy Row Block */}
                    <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            By registering, your profile is routed to the validation pool. For help, contact support.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContractorRegister;