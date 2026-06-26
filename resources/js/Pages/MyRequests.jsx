import TenantLayout from './TenantLayout';
import { Head, router, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import ReviewModal from '@/Components/ReviewModal';

// Universal Icon Wrapper
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined text-lg ${className}`}>
        {name}
    </span>
);

export default function MyRequests({ requests }) {
    // Local state to control the review modal visibility
    const [selectedRequestForReview, setSelectedRequestForReview] = useState(null);
    
    // ✅ NEW STATE LAYER: Tracks active asynchronous M-Pesa sandbox transaction loops
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Laravel Over-The-Wire Routing Methods
    function confirm(id) {
        router.post(`/requests/${id}/confirm`);
    }

    // ✅ FIXED ACTION HOOK: Implements safety toggles to handle network responses or cancellations gracefully
    function handleMockPayment(id) {
        setIsProcessingPayment(true);
        router.post(`/requests/${id}/pay`, {}, {
            onFinish: () => setIsProcessingPayment(false) // Automatically releases UI lock when response returns
        });
    }

    function cancelRequest(id) {
        router.post(`/requests/${id}/cancel`);
    }

    function changeContractor(id) {
        router.post(`/requests/${id}/change-contractor`);
    }

    function confirmPrice(id) {
        router.post(`/requests/${id}/confirm-price`);
    }

    return (
        <TenantLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    My Repair Requests
                </h2>
            }
        >
            <Head title="My Requests" />

            <div className="py-2 bg-[#f8fafc] dark:bg-gray-900 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-5xl">
                    
                    {/* Page Intro Header */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Request History & Tracking Workspace
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Monitor live physical site inspections, confirm specialized project quotes, and submit certified feedback loop rankings.
                        </p>
                    </div>

                    {/* ================= REQUESTS RENDER LOOP ================= */}
                    {requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 mb-3">
                                <Icon name="rule" className="text-2xl" />
                            </div>
                            <h4 className="text-base font-bold text-gray-800 dark:text-white">No requests registered yet</h4>
                            <p className="text-xs text-gray-400 text-center mt-1">
                                Launch your first repair breakdown entry from the central Tenant Dashboard pipeline.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {requests.map((req) => {
                                
                                // System Status Tag Mappings
                                let badgeClass = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
                                if (req.status === 'pending') badgeClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                                if (req.status === 'accepted') badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                                if (req.status === 'inspection') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
                                if (req.status === 'price_pending_confirmation') badgeClass = 'bg-orange-50 text-orange-700 border-orange-200';
                                if (req.status === 'declined') badgeClass = 'bg-red-50 text-red-700 border-red-200';
                                if (req.status === 'in_progress') badgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                                if (req.status === 'awaiting_confirmation') badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                                if (req.status === 'awaiting_payment') badgeClass = 'bg-pink-50 text-pink-700 border-pink-200';
                                if (req.status === 'paid') badgeClass = 'bg-green-50 text-green-700 border-green-200';
                                if (req.status === 'cancelled') badgeClass = 'bg-gray-50 text-gray-600 border-gray-200';

                                return (
                                    <div
                                        key={req.id}
                                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4 transition-all hover:shadow-md"
                                    >
                                        {/* Top Card Bar - Title & Badge */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-50 dark:border-gray-700/50">
                                            <div>
                                                <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
                                                    {req.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5">Reference ID: #{String(req.id).padStart(5, '0')}</p>
                                            </div>
                                            <span className={`inline-self-start sm:inline-block px-2.5 py-1 text-xs font-bold uppercase rounded-md border tracking-wide ${badgeClass}`}>
                                                {req.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>

                                        {/* Description Prose */}
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {req.description}
                                        </p>

                                        {/* Metadata Panel Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-1.5 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700/30">
                                            <div className="flex items-center gap-2">
                                                <Icon name="construction" className="text-blue-500" />
                                                <span><strong className="text-gray-700 dark:text-gray-300">Category:</strong> {req.category}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icon name="location_on" className="text-red-500" />
                                                <span><strong className="text-gray-700 dark:text-gray-300">Location:</strong> {req.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icon name="calendar_month" className="text-amber-500" />
                                                <span><strong className="text-gray-700 dark:text-gray-300">Scheduled:</strong> {req.scheduled_date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icon name="badge" className="text-purple-500" />
                                                <span><strong className="text-gray-700 dark:text-gray-300">Contractor:</strong> {req.contractor ? req.contractor.name : 'Unassigned'}</span>
                                            </div>
                                        </div>

                                        {/* ================= CONTEXTUAL WORKFLOW STATES ================= */}

                                        {/* Dynamic withdrawal recovery callout banner */}
                                        {req.status === 'pending' && !req.contractor_id && (
                                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                <p className="text-xs text-amber-800 dark:text-amber-400 font-medium flex items-center gap-1.5">
                                                    <Icon name="warning" className="text-amber-600" />
                                                    The assigned contractor has withdrawn from this inspection session. You can now choose a replacement specialist.
                                                </p>
                                                <Link
                                                    href={`/select-contractor/${req.id}`}
                                                    className="w-full sm:w-auto bg-[#004ac6] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg text-center transition-colors shadow-sm whitespace-nowrap"
                                                >
                                                    Select New Contractor
                                                </Link>
                                            </div>
                                        )}

                                        {/* Standard dynamic loop indicator fields */}
                                        {req.status === 'pending' && req.contractor_id && (
                                            <p className="text-xs text-yellow-600 font-medium bg-yellow-50/50 p-2.5 rounded-lg flex items-center gap-1.5">🔔 Awaiting assigned maintenance technician verification details...</p>
                                        )}
                                        {req.status === 'accepted' && (
                                            <p className="text-xs text-blue-600 font-medium bg-blue-50/50 p-2.5 rounded-lg flex items-center gap-1.5">✓ Specialist has accepted your job booking entry.</p>
                                        )}
                                        {req.status === 'inspection' && (
                                            <p className="text-xs text-amber-600 font-medium bg-amber-50/50 p-2.5 rounded-lg flex items-center gap-1.5 animate-pulse">🛠️ Technician is actively conducting physical site assessment operations...</p>
                                        )}

                                        {/* Price Pending Confirmation Proposal Block */}
                                        {req.status === 'price_pending_confirmation' && (
                                            <div className="p-4 bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl space-y-3">
                                                <p className="text-orange-800 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">Post-Inspection Price Proposal</p>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">The assigned contractor has audited the repair parameters and logged a financial quote requirements baseline:</p>
                                                <div className="text-lg font-extrabold text-gray-900 dark:text-white">KES {req.agreed_price}</div>
                                                <button
                                                    onClick={() => confirmPrice(req.id)}
                                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                                                >
                                                    <Icon name="lock_open" className="text-white text-sm" /> Confirm Price & Authorize Execution
                                                </button>
                                            </div>
                                        )}

                                        {/* Declined Accordion Text Block */}
                                        {req.status === 'declined' && (
                                            <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-lg">⚠️ The selected contractor was unable to book this job request entry. Please select an alternate specialist line below.</p>
                                        )}

                                        {/* In Progress Panel Banner Statement */}
                                        {req.status === 'in_progress' && (
                                            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-xs text-indigo-700 dark:text-indigo-400 font-bold flex justify-between items-center">
                                                <span>🔨 Repair execution active... Work parameters locked under authorization threshold.</span>
                                                <span className="font-mono bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded">Authorized Cost: KES {req.agreed_price}</span>
                                            </div>
                                        )}

                                        {/* Awaiting Sign Off Operational Triggers */}
                                        {req.status === 'awaiting_confirmation' && (
                                            <div className="p-4 bg-purple-50/60 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-xl space-y-3">
                                                <p className="text-purple-700 dark:text-purple-400 text-xs font-bold tracking-wider uppercase">Contractor Sign-Off Dispatch</p>
                                                <p className="text-gray-600 dark:text-gray-300 text-xs">The technical expert has marked physical operations complete. Verify the quality parameters before initializing payment routines.</p>
                                                <button
                                                    onClick={() => confirm(req.id)}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors"
                                                >
                                                    Confirm Quality & Close Workspace
                                                </button>
                                            </div>
                                        )}

                                        {/* Read-Only Gateway Routing Interface */}
                                        {req.status === 'awaiting_payment' && (
                                            <div className="p-4 bg-pink-50/70 dark:bg-pink-950/10 border border-pink-200 dark:border-pink-900/30 rounded-xl space-y-3 max-w-md">
                                                <h5 className="text-pink-800 dark:text-pink-400 font-extrabold text-sm flex items-center gap-1">✔ Work Integrity Verified</h5>
                                                <p className="text-xs text-gray-700 dark:text-gray-300"><strong>Outstanding Balance:</strong> <span className="text-sm font-black text-gray-900 dark:text-white">KES {req.agreed_price}</span></p>
                                                <div className="p-3 bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-lg text-[11px] text-gray-500 space-y-1">
                                                    <p>The system will dispatch an M-Pesa STK Push credential PIN dialogue box instantly to your mobile sequence number:</p>
                                                    <p className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xs">📱 {req.user?.phone || 'No binding mobile parameters mapped'}</p>
                                                </div>
                                                
                                                {/* ✅ ENHANCED TRIGGER: Wire frame state locking added to prevent connection processing freeze loops */}
                                                <button
                                                    disabled={isProcessingPayment}
                                                    onClick={() => handleMockPayment(req.id)}
                                                    className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg text-xs font-bold shadow-sm transition-colors"
                                                >
                                                    {isProcessingPayment ? 'Awaiting M-Pesa Gateway...' : 'Dispatch Safaricom STK Push'}
                                                </button>
                                            </div>
                                        )}

                                        {/* Completed Success Closure Wrapper Box Row */}
                                        {req.status === 'paid' && (
                                            <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-200 dark:border-green-900/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-green-700 dark:text-green-400 font-bold text-sm flex items-center gap-1">✔ Transaction Settled & Request Closed</div>
                                                    <p className="text-gray-400 font-normal text-xs mt-0.5">Disbursed via Daraja Sandbox: KES {req.agreed_price}</p>
                                                </div>
                                                
                                                {/* Inertia Driven Dynamic Rating Modal Launch Hooks */}
                                                {!req.review ? (
                                                    <button
                                                        onClick={() => setSelectedRequestForReview(req)}
                                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1 self-start sm:self-auto"
                                                    >
                                                        ⭐ Submit Feedback Review
                                                    </button>
                                                ) : (
                                                    <div className="text-xs font-bold text-green-600 dark:text-green-400 italic bg-green-100/60 dark:bg-green-900/20 px-3 py-1.5 rounded-md border border-green-200/40">
                                                        ✓ Rated: {req.review.rating}/5 Stars
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Transaction Segment Footer Action Buttons */}
                                        <div className="flex gap-3 pt-3 border-t border-gray-50 dark:border-gray-700/50">
                                            {(req.status === 'pending' || 
                                              req.status === 'accepted' || 
                                              req.status === 'inspection' || 
                                              req.status === 'price_pending_confirmation' || 
                                              req.status === 'declined') && (
                                                <button
                                                    onClick={() => cancelRequest(req.id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-red-100"
                                                >
                                                    Cancel Request
                                                </button>
                                            )}

                                            {req.status === 'declined' && (
                                                <button
                                                    onClick={() => changeContractor(req.id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors"
                                                >
                                                    Select Alternate Specialist
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Popup Modal Hook */}
            {selectedRequestForReview && (
                <ReviewModal
                    request={selectedRequestForReview}
                    onClose={() => setSelectedRequestForReview(null)}
                />
            )}
        </TenantLayout>
    );
}