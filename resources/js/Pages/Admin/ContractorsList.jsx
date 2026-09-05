import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// UNIVERSAL ICON HELPER
const Icon = ({ name, filled = false, className = '' }) => (
    <span 
        className={`material-symbols-outlined select-none text-[22px] ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400" } : {}}
    >
        {name}
    </span>
);

export default function ContractorsList({ auth, contractors = [], pending_approvals_count = 0 }) {
    // Support both 'active' and 'approved' status conventions
    const activeContractors = contractors.filter(c => c.status === 'active' || c.status === 'approved');

    return (
        <AuthenticatedLayout user={router.page?.props?.auth?.user}>
            <Head title="Verified Contractors" />

            <div className="bg-[#f8f9ff] dark:bg-[#0F172A] text-[#0b1c30] dark:text-slate-100 font-sans min-h-screen flex flex-col md:flex-row antialiased">

                {/* ================= SIDEBAR NAVIGATION ================= */}
                <aside className="bg-[#eff4ff] dark:bg-[#0B132B] h-screen w-64 fixed left-0 top-0 border-r border-[#c3c6d7] dark:border-slate-800 z-30 hidden md:flex flex-col p-4 gap-2">
                    
                    {/* Brand Header */}
                    <div className="mb-6 px-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2563eb] rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Icon name="build_circle" filled={true} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[#004ac6] dark:text-white leading-tight">RepairLink</h1>
                            <p className="text-xs text-[#434655] dark:text-slate-400 font-medium">Admin Console</p>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex flex-col gap-1 flex-grow">
                        <Link 
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-[#434655] dark:text-slate-300 hover:bg-[#dce9ff] dark:hover:bg-slate-800 rounded-xl transition font-medium"
                        >
                            <Icon name="dashboard" />
                            <span className="text-sm">Dashboard</span>
                        </Link>

                        <Link 
                            href="/admin/contractors/approvals"
                            className="flex items-center justify-between px-4 py-3 text-[#434655] dark:text-slate-300 hover:bg-[#dce9ff] dark:hover:bg-slate-800 rounded-xl transition font-medium"
                        >
                            <div className="flex items-center gap-3">
                                <Icon name="how_to_reg" />
                                <span className="text-sm">Approvals</span>
                            </div>
                            {pending_approvals_count > 0 && (
                                <span className="bg-[#bc4800] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {pending_approvals_count}
                                </span>
                            )}
                        </Link>

                        <Link 
                            href="/admin/contractors"
                            className="flex items-center gap-3 px-4 py-3 bg-[#2563eb] text-white rounded-xl font-semibold shadow-sm transition"
                        >
                            <Icon name="engineering" filled={true} />
                            <span className="text-sm">Contractors</span>
                        </Link>
                    </div>

                    {/* Bottom Utility Nav */}
                    <div className="mt-auto flex flex-col gap-1 border-t border-[#c3c6d7] dark:border-slate-800 pt-4">
                        <Link 
                            href="/profile" 
                            className="flex items-center gap-3 px-4 py-2.5 text-[#434655] dark:text-slate-400 hover:bg-[#dce9ff] dark:hover:bg-slate-800 rounded-xl transition text-sm font-medium"
                        >
                            <Icon name="settings" />
                            <span>Settings</span>
                        </Link>
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition text-sm font-medium"
                        >
                            <Icon name="logout" />
                            <span>Logout</span>
                        </Link>
                    </div>
                </aside>

                {/* ================= MAIN CONTENT AREA ================= */}
                <main className="md:ml-64 flex-1 flex flex-col min-w-0">
                    {/* Workspace Canvas */}
                    <div className="p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
                        
                        {/* Page Header */}
                        <div>
                            <h2 className="text-3xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight">Active Contractors</h2>
                            <p className="text-base text-[#434655] dark:text-slate-400 mt-1">
                                List of all approved contractors who can receive repair jobs on the platform.
                            </p>
                        </div>

                        {/* ================= DIRECTORY LISTING CONTAINER ================= */}
                        <div className="bg-white dark:bg-[#152238] border border-[#c3c6d7]/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#c3c6d7]/40 dark:border-slate-800 bg-[#eff4ff] dark:bg-[#0B132B] flex items-center justify-between">
                                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Contractor List</h3>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-800 border border-[#c3c6d7] dark:border-slate-700 text-[#434655] dark:text-slate-300 rounded-lg">
                                    {activeContractors.length} Total
                                </span>
                            </div>

                            <div className="divide-y divide-[#c3c6d7]/30 dark:divide-slate-800">
                                {activeContractors.length > 0 ? (
                                    activeContractors.map((contractor) => (
                                        <div 
                                            key={contractor.id} 
                                            className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] dark:bg-emerald-950/40 text-[#2e7d32] dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                    <Icon name="verified" filled={true} className="text-2xl" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-base font-bold text-[#0b1c30] dark:text-white leading-none">
                                                            {contractor.name}
                                                        </h4>
                                                        <span className="text-[10px] font-extrabold uppercase text-[#2e7d32] bg-[#e8f5e9] dark:bg-emerald-950/40 px-2 py-0.5 rounded-md tracking-wider">
                                                            Approved
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-400">
                                                            ID #{String(contractor.id).padStart(4, '0')}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-[#434655] dark:text-slate-400 font-mono">
                                                        {contractor.email} &bull; {contractor.phone || contractor.contractor_profile?.phone || 'No phone number'}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                                                        {/* Trade Badge */}
                                                        <span className="inline-flex items-center gap-1 bg-[#eff4ff] dark:bg-slate-800 text-[#004ac6] dark:text-blue-300 px-2.5 py-1 rounded-lg text-xs font-semibold border border-[#d3e4fe] dark:border-slate-700">
                                                            <Icon name="construction" className="text-sm" />
                                                            {contractor.trade || contractor.contractor_profile?.trade || 'General Repairs'}
                                                        </span>

                                                        {/* Experience Badge (if available) */}
                                                        {contractor.contractor_profile?.years_of_experience && (
                                                            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700">
                                                                <Icon name="history_edu" className="text-sm text-slate-400" />
                                                                {contractor.contractor_profile.years_of_experience} Yrs Experience
                                                            </span>
                                                        )}

                                                        {/* Supporting Document View Link */}
                                                        {(contractor.cv_path || contractor.document_path) && (
                                                            <a 
                                                                href={`/storage/${contractor.cv_path || contractor.document_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#004ac6] dark:text-blue-400 hover:underline bg-[#dce9ff]/40 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg transition"
                                                            >
                                                                <Icon name="description" className="text-sm" />
                                                                <span>View Document</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Indicator Badge */}
                                            <div className="shrink-0 self-start md:self-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider bg-[#e8f5e9] dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-[#2e7d32] dark:text-emerald-300">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* Empty State */
                                    <div className="py-16 text-center px-4">
                                        <div className="w-14 h-14 rounded-full bg-[#dce9ff] dark:bg-slate-800 flex items-center justify-center text-[#004ac6] dark:text-blue-400 mx-auto mb-3">
                                            <Icon name="person_search" className="text-3xl" />
                                        </div>
                                        <h4 className="text-base font-bold text-[#0b1c30] dark:text-white">No Approved Contractors</h4>
                                        <p className="text-xs text-[#434655] dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                            There are currently no approved contractor accounts in the system.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}