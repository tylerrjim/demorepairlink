import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ✅ UNIVERSAL ICON WRAPPER
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined text-xl ${className}`}>
        {name}
    </span>
);

export default function ContractorApproval({ auth, contractors = [] }) {
    const { post, processing } = useForm();

    const handleApproval = (id, action) => {
        if (confirm(`Are you sure you want to ${action} this contractor application?`)) {
            // ✅ BULLETPROOF RAW PATH PATTERNS
            post(`/admin/contractors/${id}/${action}`);
        }
    };

    // ✅ FILTER: Only display requests requiring manual data vetting audits
    const pendingContractors = contractors.filter(c => c.status === 'pending' || !c.status);

    return (
        <AuthenticatedLayout 
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    System Control Center
                </h2>
            }
        >
            <Head title="Contractor Approvals" />

            <div className="bg-[#f8fafc] dark:bg-gray-900 text-[#191c1e] font-sans min-h-[calc(100vh-65px)] flex flex-col md:flex-row">

                {/* ================= SIDEBAR NAVIGATION ================= */}
                <aside className="hidden md:flex flex-col h-full w-[280px] bg-slate-50 dark:bg-gray-900 border-r border-slate-200 dark:border-gray-700 py-6 z-40">
                    <div className="px-6 mb-8">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            RepairLink <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Admin</span>
                        </span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        <NavLink href="/dashboard" icon="dashboard" active={false}>Dashboard</NavLink>
                        <NavLink href="/admin/contractors" icon="engineering" active={false}>Contractors</NavLink>
                        <NavLink href="/admin/contractors/approvals" icon="verified_user" active={true}>
                            Approvals
                            {pendingContractors.length > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    {pendingContractors.length}
                                </span>
                            )}
                        </NavLink>
                    </nav>
                </aside>

                {/* ================= MAIN CONTENT ================= */}
                <main className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto w-full">

                    {/* MANAGEMENT BANNER */}
                    <div className="mb-10 p-6 sm:p-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl shadow-lg text-white border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Icon name="verified_user" className="text-[120px]" />
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-3xl font-extrabold tracking-tight">Contractor Approvals Queue</h3>
                                <p className="text-slate-400 text-sm mt-2 max-w-xl">
                                    Review submission metrics, analyze specific skill domains, and grant application listings permission tokens over the public wire.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 px-4 py-2 rounded-xl self-start sm:self-auto shadow-inner">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                                    {pendingContractors.length} Requests Pending
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* QUEUE CARDS LOOP */}
                    <div className="space-y-4 max-w-4xl">
                        {pendingContractors.length > 0 ? (
                            pendingContractors.map((contractor) => (
                                <div 
                                    key={contractor.id} 
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                                            <Icon name="engineering" className="text-3xl" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{contractor.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-mono mt-0.5">{contractor.email}</p>
                                            
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-extrabold uppercase text-yellow-700 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/40 px-2 py-0.5 rounded-md tracking-wider">
                                                    New Submission
                                                </span>
                                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                                                    ID: #{String(contractor.id).padStart(4, '0')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* WORKFLOW CTA TRIGGER ACTION GROUP */}
                                    <div className="flex items-center gap-3">
                                        <button 
                                            disabled={processing}
                                            onClick={() => handleApproval(contractor.id, 'approve')}
                                            className="flex-1 md:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1"
                                        >
                                            <Icon name="check_circle" className="text-xs" /> Approve Access
                                        </button>
                                        <button 
                                            disabled={processing}
                                            onClick={() => handleApproval(contractor.id, 'reject')}
                                            className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-gray-700 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl transition-all border border-red-100 dark:border-transparent active:scale-95 disabled:opacity-40"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* EMPTY QUEUE CONTAINER FALLBACK */
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 shadow-sm text-center">
                                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-gray-700 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                                    <Icon name="fact_check" className="text-3xl" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Verification Queue Empty</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                                    No pending contractor applications require manual policy compliance audits right now.
                                </p>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </AuthenticatedLayout>
    );
}

// Sidebar Navigation Link Component
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