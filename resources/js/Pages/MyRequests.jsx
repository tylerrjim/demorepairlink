import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function MyRequests({ requests }) {

    // ✅ Tenant confirms completed job (Moves status to awaiting_payment)
    function confirm(id) {
        router.post(`/requests/${id}/confirm`);
    }

    // ✅ Tenant initiates payment process (Will route to M-Pesa controller trigger later)
    function handleMockPayment(id) {
        router.post(`/requests/${id}/pay`);
    }

    // ✅ Tenant cancels request
    function cancelRequest(id) {
        router.post(`/requests/${id}/cancel`);
    }

    // ✅ Tenant chooses to pick a new contractor after a decline
    function changeContractor(id) {
        router.post(`/requests/${id}/change-contractor`);
    }

    // ✅ Tenant confirms the proposed price to transition the work to In Progress
    function confirmPrice(id) {
        router.post(`/requests/${id}/confirm-price`);
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Requests</h2>}
        >
            <Head title="My Requests" />

            <div className="p-6">

                {requests.length === 0 ? (
                    <p>No requests yet.</p>
                ) : (
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="border p-4 mb-4 rounded-lg shadow-sm bg-white"
                        >
                            {/* REQUEST TITLE */}
                            <h3 className="font-bold text-lg">{req.title}</h3>

                            {/* DESCRIPTION */}
                            <p className="text-gray-600 mt-1">{req.description}</p>

                            {/* CATEGORY */}
                            <p className="mt-2">
                                <strong>Category:</strong> {req.category}
                            </p>

                            {/* LOCATION */}
                            <p className="mt-1">
                                <strong>Location:</strong> {req.location}
                            </p>

                            {/* DATE */}
                            <p className="mt-1">
                                <strong>Scheduled Date:</strong> {req.scheduled_date}
                            </p>

                            {/* STATUS BADGE */}
                            <p className="mt-3">
                                <strong>Status:</strong>{' '}
                                <span
                                    className={`px-2 py-1 text-xs rounded font-semibold ${
                                        req.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : req.status === 'accepted'
                                                ? 'bg-blue-100 text-blue-700'
                                                : req.status === 'inspection'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : req.status === 'price_pending_confirmation'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : req.status === 'declined'
                                                            ? 'bg-red-100 text-red-700'
                                                            : req.status === 'in_progress'
                                                                ? 'bg-indigo-100 text-indigo-700'
                                                                : req.status === 'awaiting_confirmation'
                                                                    ? 'bg-purple-100 text-purple-700'
                                                                    : req.status === 'awaiting_payment'
                                                                        ? 'bg-pink-100 text-pink-700'
                                                                        : req.status === 'paid'
                                                                            ? 'bg-green-100 text-green-700'
                                                                            : req.status === 'cancelled'
                                                                                ? 'bg-gray-100 text-gray-700'
                                                                                : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {req.status.replace(/_/g, ' ')}
                                </span>
                            </p>

                            {/* CONTRACTOR */}
                            <p className="mt-3">
                                <strong>Contractor:</strong>{' '}
                                {req.contractor ? req.contractor.name : 'Not assigned'}
                            </p>

                            {/* ================= STATUS FEEDBACK ================= */}

                            {/* PENDING */}
                            {req.status === 'pending' && (
                                <p className="mt-3 text-yellow-600 text-sm">
                                    Waiting for contractor assignment...
                                </p>
                            )}

                            {/* ACCEPTED */}
                            {req.status === 'accepted' && (
                                <p className="mt-3 text-blue-600 text-sm">
                                    Contractor accepted your request.
                                </p>
                            )}

                            {/* INSPECTION */}
                            {req.status === 'inspection' && (
                                <p className="mt-3 text-amber-600 text-sm font-medium animate-pulse">
                                    Contractor is currently conducting a site inspection...
                                </p>
                            )}

                            {/* PRICE PENDING CONFIRMATION */}
                            {req.status === 'price_pending_confirmation' && (
                                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                                    <p className="text-orange-700 text-sm font-medium">
                                        The contractor has completed the site inspection and proposed a total repair cost.
                                    </p>
                                    <p className="mt-2 text-base text-gray-800">
                                        <strong>Agreed Price:</strong> KES {req.agreed_price}
                                    </p>
                                    <button
                                        onClick={() => confirmPrice(req.id)}
                                        className="mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-semibold shadow-sm transition-colors"
                                    >
                                        Confirm Price & Authorize Work
                                    </button>
                                </div>
                            )}

                            {/* DECLINED */}
                            {req.status === 'declined' && (
                                <p className="mt-3 text-red-600 text-sm font-medium">
                                    The contractor declined this request. Please select a different contractor.
                                </p>
                            )}

                            {/* IN PROGRESS */}
                            {req.status === 'in_progress' && (
                                <div className="mt-3 text-sm text-indigo-700 font-medium">
                                    <p>Work is currently in progress. 🛠️</p>
                                    <p className="text-gray-500 text-xs mt-1">Authorized Cost: KES {req.agreed_price}</p>
                                </div>
                            )}

                            {/* AWAITING CONFIRMATION */}
                            {req.status === 'awaiting_confirmation' && (
                                <div className="mt-3">
                                    <p className="text-purple-600 text-sm mb-2">
                                        Contractor marked the work as finished. Please verify the physical results.
                                    </p>
                                    <button
                                        onClick={() => confirm(req.id)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors"
                                    >
                                        Confirm Completion
                                    </button>
                                </div>
                            )}

                            {/* ✅ STYLED STATE: READ-ONLY AUTO-ROUTED AWAITING PAYMENT PANEL */}
                            {req.status === 'awaiting_payment' && (
                                <div className="mt-3 p-4 bg-pink-50 border border-pink-200 rounded-lg max-w-md shadow-sm">
                                    <h4 className="text-pink-800 font-bold text-sm flex items-center gap-1">
                                        ✔ Work Completed & Verified
                                    </h4>
                                    <p className="text-gray-700 text-sm mt-2">
                                        <strong>Amount Due:</strong> <span className="text-base font-bold text-gray-900">KES {req.agreed_price}</span>
                                    </p>
                                    
                                    <div className="mt-3 p-2 bg-white rounded border border-pink-100 text-xs text-gray-600">
                                        <p>The M-Pesa STK Push authorization prompt will be dispatched automatically to your profile number:</p>
                                        <p className="mt-1 text-sm font-mono font-bold text-gray-800 tracking-wide">
                                            📱 {req.user?.phone || 'No phone record bound'}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleMockPayment(req.id)}
                                        className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-colors"
                                    >
                                        Confirm & Send STK Push
                                    </button>
                                </div>
                            )}

                            {/* PAID */}
                            {req.status === 'paid' && (
                                <div className="mt-3 text-green-600 font-semibold text-sm">
                                    <p>✔ Job Closed & Settled Successfully</p>
                                    <p className="text-gray-500 font-normal text-xs mt-0.5">Paid: KES {req.agreed_price}</p>
                                </div>
                            )}

                            {/* CANCELLED */}
                            {req.status === 'cancelled' && (
                                <p className="mt-3 text-gray-600 font-semibold">
                                    Request cancelled
                                </p>
                            )}

                            {/* ================= ACTIONS FOOTER ================= */}
                            <div className="flex gap-3 mt-4">
                                {(req.status === 'pending' || 
                                  req.status === 'accepted' || 
                                  req.status === 'inspection' || 
                                  req.status === 'price_pending_confirmation' || 
                                  req.status === 'declined') && (
                                    <button
                                        onClick={() => cancelRequest(req.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                        Cancel Request
                                    </button>
                                )}

                                {req.status === 'declined' && (
                                    <button
                                        onClick={() => changeContractor(req.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium animate-pulse"
                                    >
                                        Select New Contractor
                                    </button>
                                )}
                            </div>

                        </div>
                    ))
                )}

            </div>
        </AuthenticatedLayout>
    );
}