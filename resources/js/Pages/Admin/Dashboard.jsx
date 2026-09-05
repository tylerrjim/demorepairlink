import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';

// UNIVERSAL ICON HELPER
const Icon = ({ name, filled = false, className = '' }) => (
    <span 
        className={`material-symbols-outlined select-none text-[22px] ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400" } : {}}
    >
        {name}
    </span>
);

export default function AdminDashboard({ 
    auth, 
    stats = {}, 
    pending_contractors = [], 
    repair_requests = [],
    pending_approvals_count = 0 
}) {
    const { post, processing } = useForm();
    const [confirmModal, setConfirmModal] = useState(null); // { type: 'approve' | 'reject', contractor: object }

    // Resolve metric numbers
    const totalTenants = stats.total_tenants ?? 0;
    const totalContractors = stats.total_contractors ?? 0;
    const pendingApprovals = stats.pending_approvals ?? pending_approvals_count ?? pending_contractors.length;
    const settledRevenue = Number(stats.total_revenue ?? 0);

    // Filter or default the pending queue list
    const pendingList = pending_contractors.filter(c => c.status === 'pending' || !c.status);

    // Approval / Rejection Handlers
    const executeAction = () => {
        if (!confirmModal) return;
        const { type, contractor } = confirmModal;

        post(`/admin/contractors/${contractor.id}/${type}`, {
            preserveScroll: true,
            onSuccess: () => setConfirmModal(null),
        });
    };

    return (
        <AuthenticatedLayout user={router.page?.props?.auth?.user}>
            <Head title="Admin Dashboard" />

            {/* Confirmation Safety Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${confirmModal.type === 'approve' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-red-50 text-red-600 dark:bg-red-950/40'}`}>
                                <Icon name={confirmModal.type === 'approve' ? 'check_circle' : 'warning'} className="text-2xl" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                                {confirmModal.type} Contractor
                            </h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Are you sure you want to <strong>{confirmModal.type}</strong> the application for{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">{confirmModal.contractor.name}</span>{' '}
                            ({confirmModal.contractor.trade || 'General Repairs'})?
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-3">
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => setConfirmModal(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={executeAction}
                                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition active:scale-95 ${
                                    confirmModal.type === 'approve' 
                                        ? 'bg-[#004ac6] hover:bg-[#003ea8]' 
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {processing ? 'Processing...' : `Confirm ${confirmModal.type === 'approve' ? 'Approval' : 'Rejection'}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#f8f9ff] dark:bg-[#0F172A] text-[#0b1c30] dark:text-slate-100 font-sans min-h-screen flex flex-col md:flex-row antialiased">

                {/* ================= SIDEBAR NAVIGATION ================= */}
                <aside className="bg-[#eff4ff] dark:bg-[#0B132B] h-screen w-64 fixed left-0 top-0 border-r border-[#c3c6d7] dark:border-slate-800 z-30 hidden md:flex flex-col p-4 gap-2">
                    
                    {/* Brand */}
                    <div className="mb-6 px-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2563eb] rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Icon name="build_circle" filled={true} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[#004ac6] dark:text-white leading-tight">RepairLink</h1>
                            <p className="text-xs text-[#434655] dark:text-slate-400 font-medium">Admin Console</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="flex flex-col gap-1 flex-grow">
                        <Link 
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 bg-[#2563eb] text-white rounded-xl font-semibold shadow-sm transition"
                        >
                            <Icon name="dashboard" filled={true} />
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
                            {pendingApprovals > 0 && (
                                <span className="bg-[#bc4800] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {pendingApprovals}
                                </span>
                            )}
                        </Link>

                        <Link 
                            href="/admin/contractors"
                            className="flex items-center gap-3 px-4 py-3 text-[#434655] dark:text-slate-300 hover:bg-[#dce9ff] dark:hover:bg-slate-800 rounded-xl transition font-medium"
                        >
                            <Icon name="engineering" />
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

                {/* ================= MAIN CONTENT CANVAS ================= */}
                <main className="md:ml-64 flex-1 flex flex-col min-w-0">
                    
                    {/* Dashboard Workspace */}
                    <div className="p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
                        
                        {/* Page Introduction Title */}
                        <div>
                            <h2 className="text-3xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight">Admin Dashboard</h2>
                            <p className="text-base text-[#434655] dark:text-slate-400 mt-1">
                                Overview of registered users, pending approvals, and repair requests.
                            </p>
                        </div>

                        {/* ================= 4 KPI SUMMARY CARDS ================= */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            
                            {/* 1. Registered Tenants */}
                            <div className="bg-white dark:bg-[#152238] border border-[#c3c6d7]/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                <div className="w-12 h-12 bg-[#dce9ff] dark:bg-blue-950/50 text-[#004ac6] dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                                    <Icon name="group" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#434655] dark:text-slate-400 uppercase tracking-wider">Registered Tenants</p>
                                    <p className="text-4xl font-extrabold text-[#0b1c30] dark:text-white mt-1">{totalTenants}</p>
                                </div>
                            </div>

                            {/* 2. Active Contractors (Cleaned up, no redundant pending badge) */}
                            <div className="bg-white dark:bg-[#152238] border border-[#c3c6d7]/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                <div className="w-12 h-12 bg-[#dce9ff] dark:bg-blue-950/50 text-[#004ac6] dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                                    <Icon name="engineering" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#434655] dark:text-slate-400 uppercase tracking-wider">Active Contractors</p>
                                    <p className="text-4xl font-extrabold text-[#0b1c30] dark:text-white mt-1">{totalContractors}</p>
                                </div>
                            </div>

                            {/* 3. Pending Approvals */}
                            <div className="bg-white dark:bg-[#152238] border border-[#c3c6d7]/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                                {pendingApprovals > 0 && (
                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full m-5 animate-ping" />
                                )}
                                <div className="w-12 h-12 bg-[#ffdad6] dark:bg-red-950/50 text-[#ba1a1a] dark:text-red-400 rounded-xl flex items-center justify-center mb-4">
                                    <Icon name="fact_check" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-semibold text-[#434655] dark:text-slate-400 uppercase tracking-wider">Pending Approvals</p>
                                        <span className="text-red-600 dark:text-red-400 text-xs font-bold">Action required</span>
                                    </div>
                                    <p className="text-4xl font-extrabold text-[#0b1c30] dark:text-white mt-1">{pendingApprovals}</p>
                                </div>
                            </div>

                            {/* 4. M-Pesa Settled Volume */}
                            <div className="bg-white dark:bg-[#152238] border border-[#c3c6d7]/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                <div className="w-12 h-12 bg-[#e8f5e9] dark:bg-emerald-950/40 text-[#2e7d32] dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                                    <Icon name="account_balance_wallet" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#434655] dark:text-slate-400 uppercase tracking-wider">M-Pesa Settled Volume</p>
                                    <p className="text-2xl lg:text-3xl font-extrabold text-[#0b1c30] dark:text-white mt-1">
                                        KES {settledRevenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* ================= BENTO GRID: QUEUE & OVERVIEW ================= */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            
                            {/* Primary Section: Contractor Approval Queue */}
                            <div className="lg:col-span-1 bg-white dark:bg-[#152238] border border-[#c3c6d7]/60 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                                <div className="p-5 border-b border-[#c3c6d7]/40 dark:border-slate-800 bg-[#eff4ff] dark:bg-[#0B132B]">
                                    <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Contractor Approvals</h3>
                                    <p className="text-xs text-[#434655] dark:text-slate-400 mt-0.5">Review incoming applications</p>
                                </div>

                                <div className="divide-y divide-[#c3c6d7]/30 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
                                    {pendingList.length > 0 ? (
                                        pendingList.slice(0, 4).map((contractor) => (
                                            <div key={contractor.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-full bg-[#dce9ff] dark:bg-slate-700 flex items-center justify-center text-[#004ac6] dark:text-white font-bold shrink-0">
                                                        {contractor.name ? contractor.name.charAt(0).toUpperCase() : 'C'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white truncate">{contractor.name}</h4>
                                                        <p className="text-xs text-[#434655] dark:text-slate-400 font-medium">{contractor.trade || 'General Repairs'}</p>
                                                    </div>
                                                    <span className="bg-[#ffede6] text-[#bc4800] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                                                        Pending
                                                    </span>
                                                </div>

                                                {/* Supporting Document Link (if exists) */}
                                                {(contractor.cv_path || contractor.document_path) && (
                                                    <a 
                                                        href={`/storage/${contractor.cv_path || contractor.document_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004ac6] dark:text-blue-400 hover:underline pt-0.5"
                                                    >
                                                        <Icon name="description" className="text-sm" />
                                                        <span>View Document</span>
                                                    </a>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() => setConfirmModal({ type: 'reject', contractor })}
                                                        className="flex-1 bg-[#eff4ff] dark:bg-slate-800 border border-[#c3c6d7] dark:border-slate-700 text-[#0b1c30] dark:text-slate-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-xs font-bold py-2 rounded-xl transition"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() => setConfirmModal({ type: 'approve', contractor })}
                                                        className="flex-1 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold py-2 rounded-xl transition shadow-sm"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center px-4">
                                            <Icon name="verified" className="text-3xl text-emerald-500 mb-2" />
                                            <p className="text-sm font-bold text-[#0b1c30] dark:text-white">No Pending Approvals</p>
                                            <p className="text-xs text-[#434655] dark:text-slate-400 mt-0.5">All contractor applications have been reviewed.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 border-t border-[#c3c6d7]/40 dark:border-slate-800 bg-[#eff4ff] dark:bg-[#0B132B]">
                                    <Link 
                                        href="/admin/contractors/approvals" 
                                        className="w-full text-[#004ac6] dark:text-blue-400 hover:underline text-xs font-bold py-1.5 flex items-center justify-center gap-1 transition"
                                    >
                                        <span>View All Pending Applications</span>
                                        <Icon name="arrow_forward" className="text-sm" />
                                    </Link>
                                </div>
                            </div>

                            {/* Secondary Section: Repair Request Overview Table */}
                            <div className="lg:col-span-2 bg-white dark:bg-[#152238] border border-[#c3c6d7]/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-[#c3c6d7]/40 dark:border-slate-800 bg-[#eff4ff] dark:bg-[#0B132B] flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Repair Requests</h3>
                                        <p className="text-xs text-[#434655] dark:text-slate-400 mt-0.5">Current requests across the platform</p>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-800 border border-[#c3c6d7] dark:border-slate-700 text-[#434655] dark:text-slate-300 rounded-lg">
                                        View Only
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#c3c6d7]/40 dark:border-slate-800 text-[#434655] dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold bg-slate-50/50 dark:bg-slate-900/30">
                                                <th className="p-4">Request ID</th>
                                                <th className="p-4">Title</th>
                                                <th className="p-4">Tenant</th>
                                                <th className="p-4">Contractor</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 text-right">Agreed Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#c3c6d7]/30 dark:divide-slate-800">
                                            {repair_requests.length > 0 ? (
                                                repair_requests.slice(0, 6).map((req) => {
                                                    let badge = 'bg-[#dce9ff] text-[#004ac6]';
                                                    if (req.status === 'completed' || req.status === 'paid') badge = 'bg-[#e8f5e9] text-[#2e7d32]';
                                                    if (req.status === 'pending') badge = 'bg-yellow-100 text-yellow-800';
                                                    if (req.status === 'declined' || req.status === 'cancelled') badge = 'bg-[#ffdad6] text-[#ba1a1a]';
                                                    if (req.status === 'in_progress') badge = 'bg-indigo-50 text-indigo-700';

                                                    return (
                                                        <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                                                            <td className="p-4 font-mono font-bold text-[#434655] dark:text-slate-400">#{String(req.id).padStart(4, '0')}</td>
                                                            <td className="p-4 font-bold text-[#0b1c30] dark:text-white max-w-[160px] truncate">{req.title}</td>
                                                            <td className="p-4 text-[#434655] dark:text-slate-300">{req.user?.name || 'Tenant'}</td>
                                                            <td className="p-4 text-[#434655] dark:text-slate-300">
                                                                {req.contractor?.name ? (
                                                                    <span>{req.contractor.name}</span>
                                                                ) : (
                                                                    <span className="text-[#737686] italic">Unassigned</span>
                                                                )}
                                                            </td>
                                                            <td className="p-4">
                                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge}`}>
                                                                    {req.status?.replace(/_/g, ' ') || 'Pending'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right font-mono font-bold text-[#0b1c30] dark:text-white">
                                                                {req.agreed_price ? `KES ${Number(req.agreed_price).toLocaleString()}` : '—'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="p-8 text-center text-slate-400 italic">
                                                        No active repair requests recorded yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}