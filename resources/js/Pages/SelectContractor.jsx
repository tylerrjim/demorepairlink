import TenantLayout from './TenantLayout';
import React from 'react';
import { Head, router } from '@inertiajs/react';

export default function SelectContractor({ repair, contractors = [] }) {

    function selectContractor(id) {
        router.post(`/assign-contractor/${repair.id}`, {
            contractor_id: id
        });
    }

    //  Renders stars inline based on the user's reputation score
    const renderRating = (rating) => {
        const score = parseFloat(rating);
        if (isNaN(score) || score === 0) {
            return <span className="text-xs text-gray-400 italic">No ratings yet</span>;
        }
        return (
            <span className="text-sm font-semibold text-amber-600 flex items-center gap-1">
                ⭐ {score.toFixed(1)} / 5.0
            </span>
        );
    };

    return (
        <TenantLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    Contractor Marketplace
                </h2>
            }
        >
            <Head title="Select Contractor | RepairLink" />

            <div className="py-2 bg-[#f8fafc] dark:bg-gray-900 min-h-[calc(100vh-140px)] font-sans text-[#191c1d]">
                <div className="max-w-3xl mx-auto">
                    {/* Header Title Section */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-700 pb-4">
                        Select Contractor for: <span className="text-[#004ac6] dark:text-blue-400">{repair.title}</span>
                    </h2>

                    {/* Marketplace Container List */}
                    <div className="grid gap-4">
                        {contractors.length > 0 ? (
                            contractors.map(c => (
                                <div 
                                    key={c.id} 
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md"
                                >
                                    {/* Left Side Profile Block */}
                                    <div className="space-y-1">
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">{c.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium capitalize">
                                            🛠️ {c.contractor_profile?.trade || 'General Maintenance'}
                                        </p>
                                        
                                        {/*  INTEGRATED DYNAMIC RATINGS BAR */}
                                        <div className="pt-1">
                                            {renderRating(c.average_rating)}
                                        </div>
                                    </div>

                                    {/* Right Side Action Trigger */}
                                    <button
                                        onClick={() => selectContractor(c.id)}
                                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm"
                                    >
                                        Select Contractor
                                    </button>
                                </div>
                            ))
                        ) : (
                            /* Empty State Container Fallback */
                            <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400 italic text-sm">No active contractors are currently approved in this category list.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}