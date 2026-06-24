// Imports
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

// Icon Component
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined ${className}`}>
        {name}
    </span>
);

// Main Component
export default function ContractorDashboard({ requests, reviews = [], average_rating = 'No ratings yet' }) {

    // Sidebar active state tabs: 'Dashboard', 'My Requests', 'Active Jobs', or 'Reviews Feedback'
    const [activeTab, setActiveTab] = useState('Dashboard');

    // Holds individual price inputs keyed by repair request ID
    const [prices, setPrices] = useState({});

    // Real Laravel Actions
    function accept(id) {
        router.post(`/requests/${id}/accept`);
    }

    function decline(id) {
        router.post(`/requests/${id}/decline`);
    }

    function start(id) {
        router.post(`/requests/${id}/start`);
    }

    // Workflow Trigger: Triggers backing out of a request during inspection or acceptance phase
    function withdraw(id) {
        if (confirm("Are you sure you want to withdraw from this inspection? The request will return to the open pool so the tenant can select an alternate contractor.")) {
            router.post(`/requests/${id}/withdraw`);
        }
    }

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

    // Sidebar Filter Logic: Restricts the requests loop dynamically based on the active navbar tab
    const getFilteredRequests = () => {
        if (activeTab === 'My Requests') {
            // New requests where the contractor needs to act (Accept or Decline)
            return requests.filter(r => r.status === 'pending');
        }
        if (activeTab === 'Active Jobs') {
            // Jobs where work is actively underway or ongoing
            return requests.filter(r => ['accepted', 'inspection', 'price_pending_confirmation', 'in_progress', 'awaiting_confirmation', 'awaiting_payment'].includes(r.status));
        }
        // 'Dashboard' tab displays everything for a full historical overview
        return requests;
    };

    const filteredRequests = getFilteredRequests();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Contractor Dashboard
                </h2>
            }
        >
            <Head title="Contractor Dashboard" />

            <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col md:flex-row">

                {/* ================= SIDEBAR ================= */}
                <aside className="hidden md:flex flex-col h-full w-[280px] fixed left-0 top-0 bg-[#f7f9fb] border-r border-[#c3c6d7] py-4 z-40">
                    <div className="px-6 mb-8">
                        <span className="text-2xl font-bold text-[#004ac6]">
                            RepairLink
                        </span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {[
                            { name: 'Dashboard', icon: 'dashboard' },
                            { name: 'My Requests', icon: 'assignment' },
                            { name: 'Active Jobs', icon: 'pending_actions' },
                            { name: 'Reviews Feedback', icon: 'star' },
                        ].map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`w-[calc(100%-16px)] text-left rounded-lg mx-2 px-4 py-3 flex items-center gap-3 transition-all ${
                                    activeTab === item.name
                                        ? 'bg-[#d5e3fc] text-[#0d1c2e] translate-x-1 font-semibold border-l-4 border-[#004ac6]'
                                        : 'text-[#434655] hover:bg-[#e6e8ea]'
                                }`}
                            >
                                <Icon name={item.icon} className={activeTab === item.name ? 'text-[#004ac6]' : ''} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ================= MAIN CONTENT ================= */}
                <main className="flex-1 md:ml-[280px] min-h-screen flex flex-col pb-20 md:pb-0">
                    <div className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto w-full">

                        {/* Page Title */}
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#191c1e]">
                                {activeTab} Workspace
                            </h2>
                            <p className="text-base text-[#434655]">
                                {activeTab === 'Reviews Feedback' 
                                    ? 'Track your performance rankings and localized tenant testimonials' 
                                    : 'Manage your assigned repair and maintenance jobs in Dagoretti'}
                            </p>
                        </div>

                        {/* ================= STATS SECTION ================= */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <button onClick={() => setActiveTab('My Requests')} className="text-left focus:outline-none block w-full transition transform hover:-translate-y-0.5">
                                <div className={`bg-white p-4 rounded-xl border-l-4 border-yellow-500 shadow h-full ${activeTab === 'My Requests' ? 'ring-2 ring-yellow-400' : ''}`}>
                                    <p className="text-xs font-semibold text-[#434655] uppercase">Pending Requests</p>
                                    <h3 className="text-2xl font-bold mt-1">
                                        {requests.filter(r => r.status === 'pending').length}
                                    </h3>
                                </div>
                            </button>

                            <button onClick={() => setActiveTab('Active Jobs')} className="text-left focus:outline-none block w-full transition transform hover:-translate-y-0.5">
                                <div className={`bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow h-full ${activeTab === 'Active Jobs' ? 'ring-2 ring-blue-400' : ''}`}>
                                    <p className="text-xs font-semibold text-[#434655] uppercase">Active Jobs</p>
                                    <h3 className="text-2xl font-bold mt-1">
                                        {requests.filter(r => ['accepted', 'inspection', 'price_pending_confirmation', 'in_progress'].includes(r.status)).length}
                                    </h3>
                                </div>
                            </button>

                            <button onClick={() => setActiveTab('Active Jobs')} className="text-left focus:outline-none block w-full transition transform hover:-translate-y-0.5">
                                <div className={`bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow h-full ${activeTab === 'Active Jobs' ? 'ring-2 ring-purple-400' : ''}`}>
                                    <p className="text-xs font-semibold text-[#434655] uppercase">Awaiting Sign-Off</p>
                                    <h3 className="text-2xl font-bold mt-1">
                                        {requests.filter(r => r.status === 'awaiting_confirmation' || r.status === 'awaiting_payment').length}
                                    </h3>
                                </div>
                            </button>

                            <button onClick={() => setActiveTab('Reviews Feedback')} className="text-left focus:outline-none block w-full transition transform hover:-translate-y-0.5">
                                <div className={`bg-white p-4 rounded-xl border-l-4 border-amber-500 shadow h-full ${activeTab === 'Reviews Feedback' ? 'ring-2 ring-amber-400' : ''}`}>
                                    <p className="text-xs font-semibold text-[#434655] uppercase">Reputation Score</p>
                                    <h3 className="text-2xl font-bold mt-1 flex items-center gap-1 text-amber-600">
                                        ⭐ {average_rating}
                                    </h3>
                                </div>
                            </button>
                        </section>

                        {/* ================= CONDITIONAL CONTENT VIEWS ================= */}
                        
                        {activeTab === 'Reviews Feedback' ? (
                            /* Reviews Tab View List */
                            <section className="space-y-4">
                                <h4 className="text-xl font-semibold text-[#191c1e] mb-4">
                                    Customer Feedback & Testimonials
                                </h4>
                                {reviews.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic bg-white p-6 rounded-xl border shadow">
                                        No tenant review cards registered yet. Complete jobs to cultivate your score!
                                    </p>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev.id} className="bg-white p-5 rounded-xl border shadow-sm space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-sm text-gray-800">👤 Tenant: {rev.tenant?.name || 'Anonymous'}</span>
                                                <span className="text-amber-500 font-bold text-sm">
                                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)} ({rev.rating}/5)
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md italic border-l-4 border-gray-300">
                                                "{rev.review || 'No written commentary provided.'}"
                                            </p>
                                            <p className="text-[10px] text-gray-400 text-right">Received on: {new Date(rev.created_at).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                )}
                            </section>
                        ) : (
                            /* Filtered Workspace List Views */
                            filteredRequests.length > 0 ? (
                                <section className="space-y-4">
                                    <h4 className="text-xl font-semibold text-[#191c1e] mb-4">
                                        {activeTab === 'Dashboard' ? 'All Assigned Requests' : `${activeTab} Listings`} ({filteredRequests.length})
                                    </h4>
                                    
                                    {filteredRequests.map((req) => {
                                        let tagClass = '';
                                        if (req.status === 'pending') tagClass = 'bg-yellow-100 text-yellow-700';
                                        if (req.status === 'accepted') tagClass = 'bg-blue-100 text-blue-700';
                                        if (req.status === 'inspection') tagClass = 'bg-amber-100 text-amber-700';
                                        if (req.status === 'price_pending_confirmation') tagClass = 'bg-orange-100 text-orange-700';
                                        if (req.status === 'in_progress') tagClass = 'bg-indigo-100 text-indigo-700';
                                        if (req.status === 'awaiting_confirmation') tagClass = 'bg-purple-100 text-purple-700';
                                        if (req.status === 'awaiting_payment') tagClass = 'bg-pink-100 text-pink-700';
                                        if (req.status === 'completed' || req.status === 'paid') tagClass = 'bg-green-100 text-green-700';
                                        if (req.status === 'declined') tagClass = 'bg-red-100 text-red-700';

                                        return (
                                            <div key={req.id} className="bg-white p-6 rounded-xl border shadow">
                                                <div className="flex flex-col lg:flex-row justify-between gap-4">
                                                    {/* Left Side Data Blocks */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h5 className="text-lg font-bold">{req.title}</h5>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${tagClass}`}>
                                                                {req.status.replace(/_/g, ' ')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-[#434655] mb-3">{req.description}</p>
                                                        <div className="flex flex-wrap gap-4 text-sm text-[#434655]">
                                                            <div className="flex items-center gap-1"><Icon name="person" />{req.user?.name}</div>
                                                            <div className="flex items-center gap-1"><Icon name="category" />{req.category}</div>
                                                            <div className="flex items-center gap-1"><Icon name="location_on" />{req.location}</div>
                                                            <div className="flex items-center gap-1"><Icon name="calendar_today" />{req.scheduled_date}</div>
                                                        </div>

                                                        {/* Privacy-Bound Client Contact Panel */}
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

                                                    {/* Right Side Action Buttons */}
                                                    <div className="flex items-center gap-3">
                                                        {req.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => accept(req.id)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">Accept</button>
                                                                <button onClick={() => decline(req.id)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">Decline</button>
                                                            </>
                                                        )}
                                                        
                                                        {/* Incorporated withdrawal trigger for accepted lifecycle state */}
                                                        {req.status === 'accepted' && (
                                                            <div className="flex flex-col sm:flex-row gap-2">
                                                                <button onClick={() => start(req.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">Start Site Inspection</button>
                                                                <button onClick={() => withdraw(req.id)} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">Withdraw</button>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Incorporated withdrawal trigger for active inspection state */}
                                                        {req.status === 'inspection' && (
                                                            <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Agreed Price (KES)"
                                                                        value={prices[req.id] || ''}
                                                                        min="1"
                                                                        onChange={(e) => setPrices({...prices, [req.id]: e.target.value})}
                                                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full sm:w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                    />
                                                                    <button onClick={() => submitPrice(req.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors whitespace-nowrap shadow-sm">Submit Agreed Price</button>
                                                                </div>
                                                                <button onClick={() => withdraw(req.id)} className="text-center w-full text-xs font-bold text-red-500 hover:text-red-700 hover:underline pt-1">
                                                                    Withdraw from Project Inspection
                                                                </button>
                                                            </div>
                                                        )}
                                                        
                                                        {req.status === 'price_pending_confirmation' && (
                                                            <div className="text-right text-sm font-medium text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                                                                <p>Quote Submitted: KES {req.agreed_price}</p>
                                                                <p className="text-xs text-gray-500 font-normal mt-0.5">Awaiting tenant price confirmation</p>
                                                            </div>
                                                        )}
                                                        {req.status === 'in_progress' && (
                                                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                                                                <span className="text-sm font-semibold text-gray-600">Cost: KES {req.agreed_price}</span>
                                                                <button onClick={() => complete(req.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">Mark as Finished</button>
                                                            </div>
                                                        )}
                                                        {req.status === 'awaiting_confirmation' && (
                                                            <p className="text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 italic">Waiting for tenant completion sign-off</p>
                                                        )}
                                                        {req.status === 'awaiting_payment' && (
                                                            <div className="text-right text-sm font-semibold text-pink-600 bg-pink-50 px-4 py-2 rounded-lg border border-pink-100">
                                                                <p>Work Verified</p>
                                                                <p className="text-xs text-gray-500 font-normal mt-0.5">Awaiting M-Pesa Settlement: KES {req.agreed_price}</p>
                                                            </div>
                                                        )}
                                                        {(req.status === 'completed' || req.status === 'paid') && (
                                                            <div className="text-right text-sm font-semibold text-green-600">
                                                                <p>Job completed</p>
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
                                <section className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#c3c6d7]">
                                    <h4 className="text-xl font-semibold text-[#191c1e] mb-2">No jobs listed in this section</h4>
                                    <p className="text-sm text-[#434655] text-center">Requests moving into this state filter layer automatically populate here.</p>
                                </section>
                            )
                        )}
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}