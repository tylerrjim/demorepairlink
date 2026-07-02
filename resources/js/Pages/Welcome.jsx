import React from 'react';
import { Link, Head } from '@inertiajs/react';

// UNIVERSAL ICON WRAPPER
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined ${className}`}>
        {name}
    </span>
);

const Welcome = ({ auth }) => {
    return (
        <div className="bg-[#f8fafc] text-[#191c1e] font-sans antialiased min-h-screen selection:bg-blue-500 selection:text-white scroll-smooth">
            <Head title="RepairLink - Direct Residential Maintenance Connection" />

            {/* ================= PUBLIC NAVIGATION HEADER ================= */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        
                        {/* Left Side: Application Logo & Main Links */}
                        <div className="flex items-center gap-8">
                            <a href="#" className="flex items-center gap-2 group">
                                <span className="material-symbols-outlined text-blue-600 text-2xl font-bold group-hover:scale-105 transition-transform">handshake</span>
                                <span className="font-black text-xl tracking-wider text-gray-900">
                                    Repair<span className="text-emerald-600">Link</span>
                                </span>
                            </a>

                            {/* Center Side: Desktop Anchor Navigation Links */}
                            {/* ✅ FIXED: Trimmed to Home, How It Works, and Contact Us */}
                            <div className="hidden md:flex items-center gap-6">
                                <a href="#" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                                    Home
                                </a>
                                <a href="#how-it-works" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                                    How It Works
                                </a>
                                <a href="#contact-support" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                                    Contact Us
                                </a>
                            </div>
                        </div>

                        {/* Right Side: Context-Aware Call-To-Actions Links */}
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm transition-all active:scale-[0.98]"
                                >
                                    <Icon name="space_dashboard" className="text-sm" />
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-xs sm:text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors px-3 py-2"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm transition-all active:scale-[0.98]"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ================= HERO SECTION BLOCK ================= */}
            <header className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-gradient-to-b from-white to-slate-50 border-b border-slate-100">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-2xl -z-10"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                        Connecting You with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Skilled Hands</span>, Every Step of the Way.
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-500 leading-relaxed font-medium">
                        A direct system linking residential repair needs with verified trade specialists. Create repair requests, review quotes, and track job progress all from a single workspace dashboard.
                    </p>
                    
                    {/* User Segment Separation Gateway Row */}
                    <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto">
                        <Link
                            href={route('register')}
                            className="w-full sm:w-1/2 py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            <Icon name="person" className="text-lg" />
                            Register as Tenant
                        </Link>
                        <Link
                            href={route('contractor.register')}
                            className="w-full sm:w-1/2 py-3.5 px-6 bg-white border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-emerald-700 font-bold rounded-xl shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            <Icon name="badge" className="text-lg text-emerald-600" />
                            Join as Contractor
                        </Link>
                    </div>
                </div>
            </header>

            {/* ================= STEP-BY-STEP WORKFLOW LIFECYCLE ================= */}
            <section className="py-20 bg-white" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">How It Works</h2>
                        <p className="text-sm text-gray-500 font-medium">Simple tracking milestones managing your task pipeline from start to completion.</p>
                        <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        <StepCard 
                            number="01" 
                            icon="assignment" 
                            accentColor="blue"
                            title="Submit Request" 
                            description="Select a maintenance category, describe your repair needs, and instantly file a request ticket inside your dashboard." 
                        />
                        <StepCard 
                            number="02" 
                            icon="rate_review" 
                            accentColor="emerald"
                            title="Review Quotes" 
                            description="Available contractors review the request details, perform field inspections, and submit direct pricing bids for your approval." 
                        />
                        <StepCard 
                            number="03" 
                            icon="check_circle" 
                            accentColor="blue"
                            title="Track Progress" 
                            description="Approve your preferred quote, watch the live status update, pay securely upon completion, and rate your operator." 
                        />
                    </div>
                </div>
            </section>

            {/* ================= PLATFORM VALUE PROPOSITIONS ================= */}
            <section className="py-20 bg-[#f8fafc] border-t border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">System Highlights</h2>
                        <p className="text-sm text-gray-500 font-medium">Designed for straightforward communication and reliable project completion.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <BenefitCard 
                            title="Admin Vetting" 
                            description="System administrators manually review contractor applications before granting live pipeline access."
                            icon="shield_person"
                            hoverColor="hover:border-blue-500/30"
                        />
                        <BenefitCard 
                            title="Direct System" 
                            description="Eliminates intermediate confusion by linking tenants directly with specialists for localized tasks."
                            icon="engineering"
                            hoverColor="hover:border-emerald-500/30"
                        />
                        <BenefitCard 
                            title="Status Tracking" 
                            description="Real-time dashboard status updates keep both parties informed of every phase of execution."
                            icon="query_stats"
                            hoverColor="hover:border-blue-500/30"
                        />
                        <BenefitCard 
                            title="Rating Appraisals" 
                            description="Tenants leave direct feedback reviews to maintain transparency and quality within the network."
                            icon="star"
                            hoverColor="hover:border-emerald-500/30"
                        />
                    </div>
                </div>
            </section>

            {/* ================= LANDING SYSTEM FOOTER ================= */}
            <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800" id="contact-support">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <div className="max-w-md mx-auto space-y-3">
                        <h3 className="text-2xl font-bold tracking-tight">Simplify Property Repairs</h3>
                        <p className="text-slate-400 text-sm font-medium">Connecting residential needs with skilled tradesmen smoothly and transparently.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-xs mx-auto sm:max-w-none">
                        <Link href={route('register')} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-md">
                            Register Tenant Portal
                        </Link>
                        {/* ✅ FIXED: Changed label text to "Join as Contractor" */}
                        <Link href={route('contractor.register')} className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700 font-bold text-sm rounded-xl transition-all shadow-sm">
                            Join as Contractor
                        </Link>
                    </div>
                    
                    <div className="pt-12 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium gap-4">
                        <p>© 2026 RepairLink. Built for modern property maintenance automation.</p>
                        <div className="flex items-center gap-6">
                            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
                            <span className="hover:text-slate-300 cursor-pointer transition-colors">Contact Support</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// ================= WORKFLOW CARD CHILD COMPONENT =================
const StepCard = ({ number, icon, title, description, accentColor }) => {
    const isEmerald = accentColor === 'emerald';
    return (
        <div className={`flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200/80 relative group transition-all shadow-sm hover:shadow-md ${isEmerald ? 'hover:border-emerald-500/30' : 'hover:border-blue-500/30'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-all shadow-inner ${isEmerald ? 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                <Icon name={icon} className="text-xl" />
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-2 w-full">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md font-mono tracking-wider ${isEmerald ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                    {number}
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
        </div>
    );
};

// ================= BENEFIT CARD CHILD COMPONENT =================
const BenefitCard = ({ title, description, icon, hoverColor }) => (
    <div className={`p-6 border border-slate-200/60 rounded-2xl bg-white hover:shadow-md transition-all group shadow-sm ${hoverColor}`}>
        <div className="w-10 h-10 bg-slate-50 text-slate-500 group-hover:bg-slate-100 flex items-center justify-center rounded-xl mb-5 transition-all border border-slate-100 shadow-inner">
            <Icon name={icon} className="text-lg" />
        </div>
        <h4 className="text-base font-bold mb-2 text-slate-900 tracking-tight">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">{description}</p>
    </div>
);

export default Welcome;