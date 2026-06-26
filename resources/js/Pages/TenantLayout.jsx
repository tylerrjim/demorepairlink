import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined text-lg ${className}`}>{name}</span>
);

export default function TenantLayout({ children, header }) {
    const { auth } = usePage().props;
    const [showingDropdown, setShowingDropdown] = useState(false);
    const currentPath = window.location.pathname;

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { name: 'My Requests', href: '/my-requests', icon: 'assignment' },
        { name: 'File New Request', href: '/requests/create', icon: 'add_task' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 flex flex-col">
            {/* --- TOP GLOBAL LOGO & PROFILE BAR --- */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 h-16 fixed top-0 w-full z-50 px-6 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-2xl font-bold">construction</span>
                    <span className="font-black text-xl text-gray-900 dark:text-white tracking-wider">RepairLink</span>
                    <span className="text-[10px] uppercase font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded ml-2">Tenant</span>
                </div>

                {/* Profile Settings Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setShowingDropdown(!showingDropdown)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                    >
                        {auth.user.name}
                        <Icon name="arrow_drop_down" />
                    </button>

                    {showingDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50">
                            
                            {/* Restored Profile Link Button */}
                            <Link 
                                href={route('profile.edit')} 
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition font-bold flex items-center gap-2"
                            >
                                <Icon name="person" className="text-gray-400" /> View Profile
                            </Link>

                            {/* Log Out Button */}
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition font-bold flex items-center gap-2 border-t border-gray-100 dark:border-gray-700/50"
                            >
                                <Icon name="logout" className="text-red-500" /> Log Out
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* --- CORE WORKSPACE WRAPPER --- */}
            <div className="flex flex-1 pt-16">
                {/* 🧭 VERTICAL LEFT SIDEBAR PANELS */}
                <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 fixed h-[calc(100vh-64px)] hidden md:block p-4 space-y-1.5">
                    {/* ✅ REMOVED NAVIGATION MENU LABEL TEXT TRACE FOR CLEAN DESIGN LOOKS */}
                    {navLinks.map((link) => {
                        const isActive = currentPath === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <Icon name={link.icon} className={isActive ? 'text-white' : 'text-gray-400'} />
                                {link.name}
                            </Link>
                        );
                    })}
                </aside>

                {/* 📄 MAIN CONTENT HUB SECTION */}
                <main className="flex-1 md:ml-64 p-6 sm:p-8 overflow-y-auto">
                    {header && (
                        <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/50">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}