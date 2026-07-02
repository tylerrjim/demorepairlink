import TenantLayout from './TenantLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

// Universal Icon Wrapper
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined text-lg ${className}`}>
        {name}
    </span>
);

export default function CreateRequest() {
    // Bound properties inside your form engine hook
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category: '',
        location: '',
        scheduled_date: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/requests');
    }

    //  DYNAMIC CONFIGURATION: Strips current date to disable past selections in the calendar
    const todayString = new Date().toLocaleDateString('sv-SE', { timeZone: 'Africa/Nairobi' });

    return (
        <TenantLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                    File Maintenance Ticket
                </h2>
            }
        >
            <Head title="Create Request" />

            <div className="py-2 bg-[#f8fafc] dark:bg-gray-900 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-3xl">

                    {/* Intro Track Banner */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Create Repair Request
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Provide complete property structural breakdown context details to assign field service experts immediately.
                        </p>
                    </div>

                    {/* ================= PREMIUM FORM CONTAINER CARD ================= */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">

                            {/* 1. Job Title Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Issue Title Summary
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g., Burst Bathroom Pipe Leakage"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border placeholder-gray-400 transition-colors"
                                    />
                                </div>
                                {errors.title && (
                                    <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {errors.title}</p>
                                )}
                            </div>

                            {/* 2. Category Selection Dropdown */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Service Track Category
                                </label>
                                <select
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="w-full text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border transition-colors"
                                >
                                    <option value="">Select Domain Specialization</option>
                                    <option value="plumbing">Plumbing Maintenance</option>
                                    <option value="electrical">Electrical Grid & Systems</option>
                                    <option value="carpentry">Carpentry & Structural Woodwork</option>
                                </select>
                                {errors.category && (
                                    <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {errors.category}</p>
                                )}
                            </div>

                            {/* 3. Comprehensive Description Textarea */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Detailed Description & Context
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="Provide operational specifications regarding structural positioning components, visible damages, or repair requirements parameters..."
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border placeholder-gray-400 transition-colors"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {errors.description}</p>
                                )}
                            </div>

                            {/* Two-Column Grid: Location & Timeline Scheduling */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                
                                {/* 4. Location Dispatch Details */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Residential Estate Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Dagoretti North"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="w-full text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border placeholder-gray-400 transition-colors"
                                    />
                                    {errors.location && (
                                        <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {errors.location}</p>
                                    )}
                                </div>

                                {/* 5. Timeline Dispatch Schedule Date */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Target Inspection Date
                                    </label>
                                    <input
                                        type="date"
                                        //  FIXED: Calendar will gray out all dates before Africa/Nairobi current today metric
                                        min={todayString}
                                        value={data.scheduled_date}
                                        onChange={e => setData('scheduled_date', e.target.value)}
                                        className="w-full text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border transition-colors"
                                    />
                                    {errors.scheduled_date && (
                                        <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {errors.scheduled_date}</p>
                                    )}
                                </div>

                            </div>

                            {/* ================= SUBMISSION BUTTON INTERACTION ================= */}
                            <div className="pt-4 border-t border-gray-50 dark:border-gray-700/50 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all flex items-center gap-2"
                                >
                                    <Icon name="assignment_turned_in" className="text-white" />
                                    {processing ? 'Publishing Request...' : 'Submit Request & Select Contractor'}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </TenantLayout>
    );
}