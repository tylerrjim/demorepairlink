// ✅ IMPORTS
// Added AuthenticatedLayout + Head + router for Laravel/Inertia functionality
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';


// ✅ ICON COMPONENT
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined ${className}`}>
        {name}
    </span>
);


// ✅ MAIN COMPONENT
// CHANGED: receives REAL requests from Laravel backend
export default function ContractorDashboard({ requests }) {

    // Sidebar active state
    const [activeTab, setActiveTab] = useState('Dashboard');

    // ✅ NEW STATE: Holds individual price inputs keyed by repair request ID
    const [prices, setPrices] = useState({});


    // ✅ REAL LARAVEL ACTIONS
    function accept(id) {
        router.post(`/requests/${id}/accept`);
    }

    function decline(id) {
        router.post(`/requests/${id}/decline`);
    }

    // Advances request to 'inspection' state
    function start(id) {
        router.post(`/requests/${id}/start`);
    }

    // Sends the calculated quote to the tenant
    function submitPrice(id) {
        if (!prices[id] || prices[id] <= 0) {
            alert("Please enter a valid price greater than 0");
            return;
        }
        router.post(`/requests/${id}/submit-price`, {
            agreed_price: prices[id]
        });
    }

    function complete(id) {
        router.post(`/requests/${id}/complete`);
    }


    return (

        // ✅ AUTHENTICATED LAYOUT
        // Restores Laravel navbar, logout, profile handling
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Contractor Dashboard
                </h2>
            }
        >

            {/* ✅ PAGE TITLE */}
            <Head title="Contractor Dashboard" />

            <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col md:flex-row">

                {/* ================= SIDEBAR ================= */}
                <aside className="hidden md:flex flex-col h-full w-[280px] fixed left-0 top-0 bg-[#f7f9fb] border-r border-[#c3c6d7] py-4 z-40">

                    {/* LOGO */}
                    <div className="px-6 mb-8">
                        <span className="text-2xl font-bold text-[#004ac6]">
                            RepairLink
                        </span>
                    </div>

                    {/* NAVIGATION */}
                    <nav className="flex-1 space-y-1">

                        {[
                            { name: 'Dashboard', icon: 'dashboard' },
                            { name: 'My Requests', icon: 'assignment' },
                            { name: 'Active Jobs', icon: 'pending_actions' },

                        ].map((item) => (

                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`w-[calc(100%-16px)] text-left rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-all ${
                                    activeTab === item.name
                                        ? 'bg-[#d5e3fc] text-[#0d1c2e] translate-x-1 font-semibold'
                                        : 'text-[#434655] hover:bg-[#e6e8ea]'
                                }`}
                            >

                                <Icon name={item.icon} />

                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>

                            </button>
                        ))}
                    </nav>

                </aside>


                {/* ================= MAIN CONTENT ================= */}
                <main className="flex-1 md:ml-[280px] min-h-screen flex flex-col pb-20 md:pb-0">

                    {/* ================= CONTENT AREA ================= */}
                    <div className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto w-full">

                        {/* PAGE TITLE */}
                        <div className="mb-8">

                            <h2 className="text-2xl md:text-3xl font-semibold text-[#191c1e]">
                                Contractor Dashboard
                            </h2>

                            <p className="text-base text-[#434655]">
                                Manage your assigned repair and maintenance jobs
                            </p>

                        </div>


                        {/* ================= STATS SECTION ================= */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                            <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow">
                                <p className="text-xs font-semibold text-[#434655] uppercase">
                                    Pending Requests
                                </p>

                                <h3 className="text-2xl font-bold mt-1">
                                    {
                                        requests.filter(r => r.status === 'pending').length
                                    }
                                </h3>
                            </div>

                            <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow">
                                <p className="text-xs font-semibold text-[#434655] uppercase">
                                    Active Jobs
                                </p>

                                <h3 className="text-2xl font-bold mt-1">
                                    {
                                        requests.filter(r => r.status === 'in_progress').length
                                    }
                                </h3>
                            </div>

                            <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow">
                                <p className="text-xs font-semibold text-[#434655] uppercase">
                                    Awaiting Sign-Off
                                </p>

                                <h3 className="text-2xl font-bold mt-1">
                                    {
                                        requests.filter(r => r.status === 'awaiting_confirmation' || r.status === 'awaiting_payment').length
                                    }
                                </h3>
                            </div>

                            <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow">
                                <p className="text-xs font-semibold text-[#434655] uppercase">
                                    Settled Revenue Jobs
                                </p>

                                <h3 className="text-2xl font-bold mt-1">
                                    {
                                        requests.filter(r => r.status === 'completed' || r.status === 'paid').length
                                    }
                                </h3>
                            </div>

                        </section>


                        {/* ================= JOBS SECTION ================= */}
                        {requests.length > 0 ? (

                            <section className="space-y-4">

                                <h4 className="text-xl font-semibold text-[#191c1e] mb-4">
                                    Assigned Jobs
                                </h4 >

                                {/* ✅ REAL REQUESTS LOOP */}
                                {requests.map((req) => {

                                    // STATUS COLORS
                                    let tagClass = '';

                                    if (req.status === 'pending')
                                        tagClass = 'bg-yellow-100 text-yellow-700';

                                    if (req.status === 'accepted')
                                        tagClass = 'bg-blue-100 text-blue-700';

                                    if (req.status === 'inspection')
                                        tagClass = 'bg-amber-100 text-amber-700';

                                    if (req.status === 'price_pending_confirmation')
                                        tagClass = 'bg-orange-100 text-orange-700';

                                    if (req.status === 'in_progress')
                                        tagClass = 'bg-indigo-100 text-indigo-700';

                                    if (req.status === 'awaiting_confirmation')
                                        tagClass = 'bg-purple-100 text-purple-700';

                                    if (req.status === 'awaiting_payment')
                                        tagClass = 'bg-pink-100 text-pink-700';

                                    if (req.status === 'completed' || req.status === 'paid')
                                        tagClass = 'bg-green-100 text-green-700';

                                    if (req.status === 'declined')
                                        tagClass = 'bg-red-100 text-red-700';


                                    return (

                                        <div
                                            key={req.id}
                                            className="bg-white p-6 rounded-xl border shadow"
                                        >

                                            <div className="flex flex-col lg:flex-row justify-between gap-4">

                                                {/* LEFT SIDE */}
                                                <div>

                                                    <div className="flex items-center gap-2 mb-2">

                                                        <h5 className="text-lg font-bold">
                                                            {req.title}
                                                        </h5>

                                                        {/* STATUS BADGE */}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${tagClass}`}>
                                                            {req.status.replace(/_/g, ' ')}
                                                        </span>

                                                    </div>

                                                    <p className="text-sm text-[#434655] mb-3">
                                                        {req.description}
                                                    </p>

                                                    {/* JOB DETAILS */}
                                                    <div className="flex flex-wrap gap-4 text-sm text-[#434655]">

                                                        {/* ✅ REAL TENANT NAME DISPLAY */}
                                                        <div className="flex items-center gap-1">
                                                            <Icon name="person" />
                                                            {req.user?.name}
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <Icon name="category" />
                                                            {req.category}
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <Icon name="location_on" />
                                                            {req.location}
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <Icon name="calendar_today" />
                                                            {req.scheduled_date}
                                                        </div>

                                                    </div>

                                                    {/* ✅ PRIVACY-BOUND CLIENT CONTACT PANEL */}
                                                    {req.status !== 'pending' && req.status !== 'completed' && req.status !== 'paid' && req.status !== 'cancelled' ? (
                                                        <div className="mt-4 p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between max-w-md">
                                                            <div>
                                                                <p className="text-[11px] uppercase text-blue-600 font-bold tracking-wider">Verified Contact Details</p>
                                                                <p className="text-sm font-semibold text-gray-800 mt-0.5">{req.user?.phone || 'No phone registered'}</p>
                                                            </div>
                                                            {req.user?.phone && (
                                                                <a 
                                                                    href={`tel:${req.user.phone}`} 
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors"
                                                                >
                                                                    📞 Call Client
                                                                </a>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        req.status === 'pending' && (
                                                            <p className="mt-3 text-xs text-gray-400 italic flex items-center gap-1">
                                                                🔒 Contact information hidden until request acceptance.
                                                            </p>
                                                        )
                                                    )}

                                                </div>


                                                {/* ================= ACTION BUTTONS ================= */}
                                                <div className="flex items-center gap-3">

                                                    {/* PENDING */}
                                                    {req.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => accept(req.id)}
                                                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                                                            >
                                                                Accept
                                                            </button>

                                                            <button
                                                                onClick={() => decline(req.id)}
                                                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                                                            >
                                                                Decline
                                                            </button>
                                                        </>
                                                    )}


                                                    {/* ACCEPTED ➔ START SITE INSPECTION */}
                                                    {req.status === 'accepted' && (
                                                        <button
                                                            onClick={() => start(req.id)}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                                                        >
                                                            Start Site Inspection
                                                        </button>
                                                    )}


                                                    {/* INSPECTION ➔ PROPOSE QUOTATION PRICE */}
                                                    {req.status === 'inspection' && (
                                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                            <input
                                                                type="number"
                                                                placeholder="Agreed Price (KES)"
                                                                value={prices[req.id] || ''}
                                                                min="1"
                                                                onChange={(e) =>
                                                                    setPrices({
                                                                        ...prices,
                                                                        [req.id]: e.target.value
                                                                    })
                                                                }
                                                                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full sm:w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            />
                                                            <button
                                                                onClick={() => submitPrice(req.id)}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors whitespace-nowrap shadow-sm"
                                                            >
                                                                Submit Agreed Price
                                                            </button>
                                                        </div>
                                                    )}


                                                    {/* PRICE PENDING CONFIRMATION */}
                                                    {req.status === 'price_pending_confirmation' && (
                                                        <div className="text-right text-sm font-medium text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                                                            <p>Quote Submitted: KES {req.agreed_price}</p>
                                                            <p className="text-xs text-gray-500 font-normal mt-0.5">Awaiting tenant price confirmation</p>
                                                        </div>
                                                    )}


                                                    {/* IN PROGRESS */}
                                                    {req.status === 'in_progress' && (
                                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                                                            <span className="text-sm font-semibold text-gray-600">Cost: KES {req.agreed_price}</span>
                                                            <button
                                                                onClick={() => complete(req.id)}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                                                            >
                                                                Mark as Finished
                                                            </button>
                                                        </div>
                                                    )}


                                                    {/* AWAITING CONFIRMATION */}
                                                    {req.status === 'awaiting_confirmation' && (
                                                        <p className="text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 italic">
                                                            Waiting for tenant completion sign-off
                                                        </p>
                                                    )}

                                                    {/* ✅ AWAITING PAYMENT ROW STAGE */}
                                                    {req.status === 'awaiting_payment' && (
                                                        <div className="text-right text-sm font-semibold text-pink-600 bg-pink-50 px-4 py-2 rounded-lg border border-pink-100">
                                                            <p>Work Verified ✔</p>
                                                            <p className="text-xs text-gray-500 font-normal mt-0.5">Awaiting M-Pesa Settlement: KES {req.agreed_price}</p>
                                                        </div>
                                                    )}


                                                    {/* COMPLETED / PAID */}
                                                    {(req.status === 'completed' || req.status === 'paid') && (
                                                        <div className="text-right text-sm font-semibold text-green-600">
                                                            <p>Job completed ✔</p>
                                                            <p className="text-xs text-gray-500 font-normal mt-0.5">Earned: KES {req.agreed_price}</p>
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}

                            </section>

                        ) : (

                            // EMPTY STATE
                            <section className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#c3c6d7]">

                                <h4 className="text-xl font-semibold text-[#191c1e] mb-2">
                                    No assigned jobs yet
                                </h4>

                                <p className="text-sm text-[#434655] text-center">
                                    New repair requests will appear here once assigned.
                                </p>

                            </section>

                        )}

                    </div>

                </main>

            </div>

        </AuthenticatedLayout>
    );
}