import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

//  UNIVERSAL ICON WRAPPER
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined text-xl ${className}`}>
        {name}
    </span>
);

export default function Dashboard({ auth, pending_approvals_count = 0 }) {
    return (
        <AuthenticatedLayout 
            // Removed the 'header' property prop block entirely to eliminate 
            // the duplicate, messy secondary title banner stretching across the workspace window.
            user={router.page?.props?.auth?.user}
        >
            <Head title="Admin Dashboard" />

            {/* Adjusted the layout container flow with absolute layout boundaries */}
            <div className="bg-[#f8fafc] dark:bg-gray-900 text-[#191c1e] font-sans min-h-screen flex flex-col md:flex-row pt-16 md:pt-0">

                {/* ================= SIDEBAR NAVIGATION ================= */}
                <aside className="hidden md:flex flex-col h-full w-[280px] bg-slate-50 dark:bg-gray-900 border-r border-slate-200 dark:border-gray-700 py-6 fixed left-0 top-0 z-40">
                    <div className="px-6 mb-8">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            RepairLink <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Admin</span>
                        </span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {/* SAFE ABSOLUTE PATHS TO PREVENT JAVASCRIPT CRASHES */}
                        <NavLink href="/dashboard" icon="dashboard" active={true}>Dashboard</NavLink>
                        <NavLink href="/admin/contractors" icon="engineering" active={false}>Contractors</NavLink>
                        <NavLink href="/admin/contractors" icon="verified_user" active={false}>
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
                {/*  Added specific top-padding controls to perfectly match the sidebar height bounds */}
                <main className="flex-1 md:ml-[280px] min-h-screen flex flex-col pb-20 md:pb-0 pt-6 md:pt-8">
                    <div className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto w-full">

                        {/* MANAGEMENT BANNER */}
                        <div className="mb-10 p-6 sm:p-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl shadow-lg text-white border border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Icon name="admin_panel_settings" className="text-[120px]" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-extrabold tracking-tight">Admin Governance Portal</h3>
                                <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                                    System-wide oversight active. Use the navigation sidebar to manage localized maintenance networks and verify professional trade credentials.
                                </p>
                            </div>
                        </div>

                        {/* PRIMARY ACTION HUD */}
                        <div className="max-w-2xl">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h4>
                            
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Icon name="how_to_reg" className="text-3xl" />
                                    </div>
                                    <div>
                                        <h5 className="text-xl font-bold text-gray-900 dark:text-white">Onboarding Queue</h5>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            Review pending contractor applications.
                                        </p>
                                    </div>
                                </div>
                                
                                <Link
                                    href="/admin/contractors"
                                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-all"
                                >
                                    <Icon name="checklist" className="text-sm" />
                                    Launch Approval Interface
                                </Link>
                            </div>
                        </div>

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