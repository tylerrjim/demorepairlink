import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function MyRequests({ requests }) {

    // ✅ NEW: Tenant confirms completed job (ADDED)
    function confirm(id) {
        router.post(`/requests/${id}/confirm`);
    }

    return (
        <AuthenticatedLayout header={<h2>My Requests</h2>}>
            <Head title="My Requests" />

            <div className="p-6">

                {requests.length === 0 ? (
                    <p>No requests yet.</p>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="border p-4 mb-4 rounded-lg shadow-sm">

                            <h3 className="font-bold text-lg">{req.title}</h3>
                            <p className="text-gray-600">{req.description}</p>

                            {/* ✅ NEW: STATUS BADGE SYSTEM (IMPROVED UI) */}
                            <p className="mt-2">
                                <strong>Status:</strong>{" "}
                                <span className={`px-2 py-1 text-xs rounded ${
                                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    req.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                    req.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700' :
                                    req.status === 'awaiting_confirmation' ? 'bg-purple-100 text-purple-700' :
                                    req.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {req.status}
                                </span>
                            </p>

                            <p className="mt-2">
                                <strong>Contractor:</strong>{' '}
                                {req.contractor ? req.contractor.name : 'Not assigned'}
                            </p>

                            {/* 🆕 NEW: TENANT CONFIRMATION STEP (MVP REQUIREMENT) */}
                            {req.status === 'awaiting_confirmation' && (
                                <button
                                    onClick={() => confirm(req.id)}
                                    className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    Confirm Completion
                                </button>
                            )}

                            {/* 🆕 NEW: COMPLETED STATE FEEDBACK */}
                            {req.status === 'completed' && (
                                <p className="mt-3 text-green-600 font-semibold">
                                    Job successfully completed ✔
                                </p>
                            )}

                            {/* 🆕 NEW: OPTIONAL USER FEEDBACK FOR PENDING */}
                            {req.status === 'pending' && (
                                <p className="mt-3 text-yellow-600 text-sm">
                                    Waiting for contractor assignment...
                                </p>
                            )}

                        </div>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}