import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';


export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!

                        </div>
                    </div>
                </div>
            </div>


            <Link
                href="/requests/create"
                className="bg-blue-600 text-white px-4 py-2"
            >
                + Create Repair Request
            </Link>

            <Link
                href="/my-requests"
                className="bg-blue-600 text-white px-4 py-2"
            >
                View My Requests
            </Link>

        </AuthenticatedLayout>
    );
}

