import TenantLayout from './TenantLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';

// Universal Icon Wrapper
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined text-lg ${className}`}>
        {name}
    </span>
);

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <TenantLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Tenant Dashboard
                </h2>
            }
        >
            <Head title="Tenant Dashboard" />

            <div className="py-2 bg-[#f8fafc] dark:bg-gray-900 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-7xl">
                    
                    {/* ================= WELCOME HERO BANNER ================= */}
                    <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-md text-white">
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Welcome Back, {user.name}!
                        </h3>
                        <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
                            Request certified maintenance specialists, track open repair listings, and manage your residential setups seamlessly.
                        </p>
                    </div>

                    {/* ================= NAVIGATION & ACTION HUB ================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        
                        {/* CARD 1: CREATE NEW REPAIR */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                    <Icon name="add_task" className="text-2xl font-bold" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Report an Issue</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">
                                    Experiencing plumbing, electrical, structural or carpentry breakdowns? Launch an authorized request pipeline immediately.
                                </p>
                            </div>
                            <Link
                                href="/requests/create"
                                className="w-full text-center inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                            >
                                + Create Repair Request
                            </Link>
                        </div>

                        {/* CARD 2: VIEW MY REVIEWS / TRACK LIFECYCLES */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                                    <Icon name="content_paste_search" className="text-2xl font-bold" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Track Progress</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">
                                    Monitor assigned quotes, oversee live physical site inspections, confirm job completion states, or process simulated M-Pesa releases.
                                </p>
                            </div>
                            <Link
                                href="/my-requests"
                                className="w-full text-center inline-block bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                            >
                                View My Requests
                            </Link>
                        </div>

                    </div>

                    {/* ================= STATUS FOOTER BANNER ================= */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <div className="p-6 text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span>System Status: Fully authenticated ecosystem session active. Security policies monitored.</span>
                        </div>
                    </div>

                </div>
            </div>
        </TenantLayout>
    );
}