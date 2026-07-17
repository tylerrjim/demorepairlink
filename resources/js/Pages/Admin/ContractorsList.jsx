import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

//  UNIVERSAL ICON WRAPPER
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined text-xl ${className}`}>
        {name}
    </span>
);

export default function ContractorsList({ auth, contractors = [], pending_approvals_count = 0 }) {
    
    // Checks for 'active' to match your database ENUM mapping perfectly
    const activeContractors = contractors.filter(c => c.status === 'active');

    return (
        <AuthenticatedLayout 
            // Removed header prop block to clear the spacing block conflict
            user={router.page?.props?.auth?.user}
        >
            <Head title="Verified Contractors" />

            {/*  Spacing and padding configuration metrics adjusted for flush sidebar layout */}
            <div className="bg-[#f8fafc] dark:bg-gray-900 text-[#191c1e] font-sans min-h-screen flex flex-col md:flex-row pt-16 md:pt-0">

                {/* ================= SIDEBAR NAVIGATION (UNIFORM DESIGN TOKENS) ================= */}
                <aside className="hidden md:flex flex-col h-full w-[280px] bg-slate-50 dark:bg-gray-900 border-r border-slate-200 dark:border-gray-700 py-6 fixed left-0 top-0 z-40">
                    <div className="px-6 mb-8">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            RepairLink <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Admin</span>
                        </span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        <NavLink href="/dashboard" icon="dashboard" active={false}>Dashboard</NavLink>
                        <NavLink href="/admin/contractors" icon="engineering" active={true}>Contractors</NavLink>
                        <NavLink href="/admin/contractors/approvals" icon="verified_user" active={false}>
                            Approvals
                            {pending_approvals_count > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    {pending_approvals_count}
                                </span>
                            )}
                        </NavLink>
                    </nav>
                </aside>

                {/* ================= MAIN CONTENT ================= */}
                {/* Standardized padding thresholds to eliminate spacing gaps */}
                <main className="flex-1 md:ml-[280px] min-h-screen flex flex-col pb-20 md:pb-0 pt-6 md:pt-8">
                    <div className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto w-full">

                        {/* REGISTRY BANNER */}
                        <div className="mb-10 p-6 sm:p-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl shadow-lg text-white border border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Icon name="engineering" className="text-[120px]" />
                            </div>
                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-3xl font-extrabold tracking-tight">Verified Trade Masters</h3>
                                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                                        Database index of all active field specialists approved to accept residential maintenance requests across the platform network ecosystem.
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 px-4 py-2 rounded-xl self-start sm:self-auto shadow-inner">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                                        {activeContractors.length} Verified Operators
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* REGISTRY LIST */}
                        <div className="space-y-4 max-w-4xl">
                            {activeContractors.length > 0 ? (
                                activeContractors.map((contractor) => (
                                    <div 
                                        key={contractor.id} 
                                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                                                <Icon name="verified" className="text-2xl" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{contractor.name}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-mono">{contractor.email}</p>
                                                
                                                {/* 🛠️ RENDER COMPREHENSIVE RECRUITMENT DETAILS */}
                                                {contractor.contractor_profile ? (
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                                                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-md capitalize font-semibold">
                                                            <Icon name="construction" className="text-xs !text-sm text-gray-400" />
                                                            {contractor.contractor_profile.trade}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-md font-semibold">
                                                            <Icon name="history_edu" className="text-xs !text-sm text-gray-400" />
                                                            {contractor.contractor_profile.years_of_experience} Yrs Exp
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 font-mono text-gray-500 dark:text-gray-400">
                                                            <Icon name="call" className="text-xs !text-sm text-gray-400" />
                                                            {contractor.contractor_profile.phone}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-red-400 italic pt-1">⚠️ Profile dataset mapping broken</p>
                                                )}

                                                {/* DEDICATED ATTACHMENT ACCESS ROUTE */}
                                                {contractor.cv_path && (
                                                    <div className="pt-2">
                                                        <a 
                                                            href={`/storage/${contractor.cv_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            <Icon name="description" className="text-xs !text-sm" />
                                                            View Verified Credentials
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="shrink-0 self-start sm:self-auto pl-18 sm:pl-0">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/40 text-emerald-700 dark:text-emerald-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* EMPTY REGISTRY STATE */
                                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 shadow-sm text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-gray-700 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                                        <Icon name="person_search" className="text-3xl" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Registry Empty</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                                        There are currently no approved contractor nodes inside the production network layout database.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}

// Sidebar Navigation Link Component
//  UNIFORM DESIGN LAYOUT FIX
const NavLink = ({ href, icon, children, active }) => (
    <Link 
        href={href} 
        className={`w-[calc(100%-24px)] text-left rounded-xl mx-3 px-4 py-3.5 flex items-center gap-3 transition-all ${
            active 
                ? 'bg-[#d5e3fc] text-[#0d1c2e] translate-x-1 font-bold border-l-4 border-slate-800' 
                : 'text-[#434655] hover:bg-slate-100 dark:hover:bg-gray-800'
        }`}
    >
        <Icon name={icon} className={active ? 'text-slate-800' : 'text-slate-400'} />
        <span className="text-sm font-medium flex items-center w-full">{children}</span>
    </Link>
);