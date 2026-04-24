import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Assuming you use Breeze's layout

export default function ContractorApproval({ auth, contractors }) {
    const { post, processing } = useForm();

    const handleApproval = (id, action) => {
        // action will be either 'approve' or 'reject'
        if (confirm(`Are you sure you want to ${action} this contractor?`)) {
            post(route(`admin.contractors.${action}`, id));
        }
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#191c1d]">
            <Head title="Contractor Approvals | RepairLink" />

            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-sm flex items-center justify-between px-6 h-20">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-2xl tracking-tight text-[#003f87]">Contractor Approvals</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">{auth.user.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium italic">System Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0056b3] flex items-center justify-center text-white font-bold overflow-hidden uppercase">
                        {auth.user.name[0]}
                    </div>
                </div>
            </header>

            {/* Sidebar Navigation */}
            <aside className="hidden md:flex h-full w-72 fixed left-0 top-0 bg-slate-50 flex-col gap-2 pt-24 pb-6 z-40 border-r border-slate-200">
                
    
                <nav className="flex flex-col gap-1">
                    <NavLink href={route('dashboard')} icon="dashboard" active={false}>Dashboard</NavLink>
                    <NavLink href="#" icon="engineering" active={false}>Contractors</NavLink>
                    <NavLink href="#" icon="verified_user" active={true}>Approvals</NavLink>
                    
                </nav>
            </aside>

            {/* Main Content */}
            <main className="pt-28 pb-12 px-4 md:ml-72 min-h-screen">
                <div className="max-w-[1000px] mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">Contractor Approvals</h2>
                                <p className="text-slate-500 mt-2 max-w-xl">Review and manage contractor registration requests. All contractors must be vetted before accessing the network.</p>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                    {contractors.length} Requests Pending
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contractor List */}
                    <div className="space-y-4">
                        {contractors.length > 0 ? (
                            contractors.map((contractor) => (
                                <div key={contractor.id} className="group bg-white p-6 rounded-xl transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-100">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-[#003f87]">
                                            <span className="material-symbols-outlined text-3xl">engineering</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{contractor.name}</h3>
                                            <p className="text-sm text-slate-500">{contractor.email}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold uppercase text-green-700 bg-green-100 px-2 py-0.5 rounded-full">New Submission</span>
                                                <span className="text-[10px] font-bold uppercase text-slate-400">ID: #{contractor.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            disabled={processing}
                                            onClick={() => handleApproval(contractor.id, 'approve')}
                                            className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-br from-green-600 to-green-800 text-white font-bold text-sm rounded-lg transition-transform active:scale-95 shadow-sm disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            disabled={processing}
                                            onClick={() => handleApproval(contractor.id, 'reject')}
                                            className="flex-1 md:flex-none px-6 py-2.5 bg-gray-100 text-red-600 font-bold text-sm rounded-lg transition-transform active:scale-95 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                                    <span className="material-symbols-outlined text-4xl text-slate-300">assignment_turned_in</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">No pending contractors</h3>
                                <p className="text-slate-500 mt-2">The queue is currently empty. Check back later for new requests.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub-component for clean sidebar links
const NavLink = ({ href, icon, children, active }) => (
    <Link 
        href={href} 
        className={`${
            active 
            ? 'bg-blue-50 text-[#003f87]' 
            : 'text-slate-600 hover:text-[#003f87]'
        } mx-2 my-1 px-4 py-3 flex items-center gap-3 transition-all rounded-lg text-sm font-semibold`}
    >
        <span className="material-symbols-outlined">{icon}</span>
        {children}
    </Link>
);