import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function MyRequests({ requests }) {
    return (
        <AuthenticatedLayout header={<h2>My Requests</h2>}>
            <Head title="My Requests" />

            <div className="p-6">
                {requests.length === 0 ? (
                    <p>No requests yet.</p>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="border p-4 mb-4">
                            <h3 className="font-bold">{req.title}</h3>
                            <p>{req.description}</p>

                            <p className="mt-2">
                                <strong>Status:</strong> {req.status}
                            </p>

                            <p>
                                <strong>Contractor:</strong>{' '}
                                {req.contractor
                                    ? req.contractor.name
                                    : 'Not assigned'}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}