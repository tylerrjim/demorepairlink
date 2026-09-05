import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
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

export default function ContractorApproval({ auth, contractors = [] }) {
    const { post, processing } = useForm();
    const [confirmModal, setConfirmModal] = useState(null); // { type: 'approve' | 'reject', contractor: object }

    // Filter for pending contractors
    const pendingContractors = contractors.filter(c => c.status === 'pending' || !c.status);

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
            <Head title="Contractor Approvals" />

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
                            className="flex items-center justify-between px-4 py-3 bg-[#2563eb] text-white rounded-xl font-semibold shadow-sm transition"
                        >
                            <div className="flex items-center gap-3">
                                <Icon name="how_to_reg" filled={true} />
                                <span className="text-sm">Approvals</span>
                            </div>
                            {pendingContractors.length > 0 && (
                                <span className="bg-white text-[#004ac6] text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {pendingContractors.length}
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

                {/* ================= MAIN CONTENT AREA ================= */}
                <main className="md:ml-64 flex-1 flex flex-col min-w-0">
                    
                    {/* Workspace Canvas */}
                    <div className="p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
                        
                        {/* Page Header */}
                        <div>
                            <h2 className="text-3xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight">Pending Contractor Approvals</h2>
                            <p className="text-base text-[#434655] dark:text-slate-400 mt-1">
                                Review contractor applications, verify documents, and approve accounts for the platform.
                            </p>
                        </div>

                        {/* ================= APPROVALS LIST ================= */}
                        <div className="bg-white dark:bg-[#152238] border border-[#c3c6d7]/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-[#c3c6d7]/40 dark:border-slate-800 bg-[#eff4ff] dark:bg-[#0B132B] flex items-center justify-between">
                                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Pending Applications</h3>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-800 border border-[#c3c6d7] dark:border-slate-700 text-[#434655] dark:text-slate-300 rounded-lg">
                                    {pendingContractors.length} Total
                                </span>
                            </div>

                            <div className="divide-y divide-[#c3c6d7]/30 dark:divide-slate-800">
                                {pendingContractors.length > 0 ? (
                                    pendingContractors.map((contractor) => (
                                        <div 
                                            key={contractor.id} 
                                            className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#dce9ff] dark:bg-blue-950/50 text-[#004ac6] dark:text-blue-400 flex items-center justify-center shrink-0">
                                                    <Icon name="engineering" className="text-2xl" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-base font-bold text-[#0b1c30] dark:text-white leading-none">
                                                            {contractor.name}
                                                        </h4>
                                                        <span className="text-[10px] font-extrabold uppercase text-[#bc4800] bg-[#ffede6] dark:bg-amber-950/30 px-2 py-0.5 rounded-md tracking-wider">
                                                            Pending
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-400">
                                                            ID #{String(contractor.id).padStart(4, '0')}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-[#434655] dark:text-slate-400 font-mono">
                                                        {contractor.email} &bull; {contractor.phone || 'No phone number'}
                                                    </p>

                                                    <div className="flex items-center gap-3 pt-1">
                                                        <span className="inline-flex items-center gap-1 bg-[#eff4ff] dark:bg-slate-800 text-[#004ac6] dark:text-blue-300 px-2.5 py-1 rounded-lg text-xs font-semibold border border-[#d3e4fe] dark:border-slate-700">
                                                            <Icon name="construction" className="text-sm" />
                                                            {contractor.trade || 'General Repairs'}
                                                        </span>

                                                        {/* Document Preview Link */}
                                                        {contractor.cv_path ? (
                                                            <a 
                                                                href={`/storage/${contractor.cv_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#004ac6] dark:text-blue-400 hover:underline bg-[#dce9ff]/40 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg transition"
                                                            >
                                                                <Icon name="description" className="text-sm" />
                                                                <span>View Document</span>
                                                            </a>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs text-[#737686] italic">
                                                                <Icon name="folder_off" className="text-sm" />
                                                                <span>No document uploaded</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 self-start sm:self-center shrink-0 w-full sm:w-auto">
                                                <button
                                                    type="button"
                                                    disabled={processing}
                                                    onClick={() => setConfirmModal({ type: 'reject', contractor })}
                                                    className="flex-1 sm:flex-none px-4 py-2.5 bg-[#eff4ff] dark:bg-slate-800 border border-[#c3c6d7] dark:border-slate-700 text-[#0b1c30] dark:text-slate-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-xs font-bold rounded-xl transition"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={processing}
                                                    onClick={() => setConfirmModal({ type: 'approve', contractor })}
                                                    className="flex-1 sm:flex-none px-5 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl transition shadow-sm active:scale-95"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* Empty Queue State */
                                    <div className="py-16 text-center px-4">
                                        <div className="w-14 h-14 rounded-full bg-[#dce9ff] dark:bg-slate-800 flex items-center justify-center text-[#004ac6] dark:text-blue-400 mx-auto mb-3">
                                            <Icon name="verified" className="text-3xl" />
                                        </div>
                                        <h4 className="text-base font-bold text-[#0b1c30] dark:text-white">No Pending Approvals</h4>
                                        <p className="text-xs text-[#434655] dark:text-slate-400 mt-1 max-w-sm mx-auto">
                                            All contractor applications have been reviewed.
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