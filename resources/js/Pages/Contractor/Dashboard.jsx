import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout header={<h2>Dashboard</h2>}>
            <Head title="Contractor Dashboard" />

            <div className="p-6">
                <h3>Contractor Dashboard</h3>
                <p>View assigned jobs</p>
            </div>
        </AuthenticatedLayout>
    );
}