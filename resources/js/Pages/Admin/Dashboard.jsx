import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout header={<h2>Dashboard</h2>}>
            <Head title="Admin Dashboard" />

            <div className="p-6">
                <h3>Admin Dashboard</h3>

                <Link href="/admin/contractors">
                    Approve Contractors
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}