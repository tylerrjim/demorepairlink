import { router } from '@inertiajs/react';

export default function Dashboard({ requests }) {

    function accept(id) {
        router.post(`/requests/${id}/accept`);
    }

    function decline(id) {
        router.post(`/requests/${id}/decline`);
    }

    function complete(id) {
        router.post(`/requests/${id}/complete`);
    }

    // ✅ NEW FIX: start job function (ADDED)
    function start(id) {
        router.post(`/requests/${id}/start`);
    }

    return (
        <div className="p-6">

            <h1 className="text-2xl mb-4">Contractor Dashboard</h1>

            {requests.length === 0 ? (
                <p>No assigned jobs.</p>
            ) : (
                requests.map((req) => (
                    <div key={req.id} className="border p-4 mb-4">

                        <h3 className="font-bold">{req.title}</h3>
                        <p>{req.description}</p>

                        <p><strong>Category:</strong> {req.category}</p>
                        <p><strong>Location:</strong> {req.location}</p>
                        <p><strong>Date:</strong> {req.scheduled_date}</p>

                        {/* ✅ FIX: Better status display (ADDED UI IMPROVEMENT) */}
                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                className={`px-2 py-1 text-xs rounded ${req.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : req.status === 'accepted'
                                        ? 'bg-green-100 text-green-700'
                                        : req.status === 'in_progress'
                                            ? 'bg-blue-100 text-blue-700'
                                            : req.status === 'awaiting_confirmation'
                                                ? 'bg-purple-100 text-purple-700'
                                                : req.status === 'completed'
                                                    ? 'bg-gray-200 text-gray-700'
                                                    : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {req.status}
                            </span>
                        </p>

                        <div className="mt-3 space-x-2">

                            {/* STEP 1: ACCEPT / DECLINE (UNCHANGED LOGIC) */}
                            {req.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => accept(req.id)}
                                        className="bg-green-600 text-white px-3 py-1"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        onClick={() => decline(req.id)}
                                        className="bg-red-600 text-white px-3 py-1"
                                    >
                                        Decline
                                    </button>
                                </>
                            )}

                            {/* ✅ FIX: NEW STEP - START JOB (ADDED) */}
                            {req.status === 'accepted' && (
                                <button
                                    onClick={() => start(req.id)}
                                    className="bg-yellow-600 text-white px-3 py-1"
                                >
                                    Start Job
                                </button>
                            )}

                            {/* 🔁 FIX: UPDATED FLOW - COMPLETE ONLY AFTER in_progress */}
                            {req.status === 'in_progress' && (
                                <button
                                    onClick={() => complete(req.id)}
                                    className="bg-blue-600 text-white px-3 py-1"
                                >
                                    Mark as Finished
                                </button>
                            )}

                            {/* 🆕 FIX: No actions during awaiting_confirmation */}
                            {req.status === 'awaiting_confirmation' && (
                                <p className="text-sm text-gray-500">
                                    Waiting for tenant confirmation
                                </p>
                            )}

                            {/* 🆕 FIX: Completed state */}
                            {req.status === 'completed' && (
                                <p className="text-green-600 text-sm font-semibold">
                                    Job completed
                                </p>
                            )}

                        </div>

                    </div>
                ))
            )}
        </div>
    );
}