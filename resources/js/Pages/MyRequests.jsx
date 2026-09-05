import React, { useState, useMemo } from 'react';
import TenantLayout from './TenantLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';
import ReviewModal from '@/Components/ReviewModal';

// Universal Material Symbols icon wrapper
const Icon = ({ name, className = '', filled = false }) => (
    <span
        className={`material-symbols-outlined select-none text-[20px] ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
        {name}
    </span>
);

export default function MyRequests({ requests = [] }) {
    // Read flash notifications and server-side validation errors from Inertia props
    const { flash = {}, errors = {} } = usePage().props;

    // Modal & Asynchronous Payment Lifecycle States
    const [selectedRequestForReview, setSelectedRequestForReview] = useState(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Dynamic phone selection state per request ID
    const [useAlternatePhone, setUseAlternatePhone] = useState({});
    const [alternatePhones, setAlternatePhones] = useState({});

    // Filtering and accordian-style card expansion
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'action' | 'completed'
    const [expandedCards, setExpandedCards] = useState({});

    // Toggle card accordion expanded/collapsed state
    const toggleExpand = (id) => {
        setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Inertia state mutation actions
    const confirm = (id) => router.post(`/requests/${id}/confirm`);
    const cancelRequest = (id) => router.post(`/requests/${id}/cancel`);
    const changeContractor = (id) => router.post(`/requests/${id}/change-contractor`);
    const confirmPrice = (id) => router.post(`/requests/${id}/confirm-price`);

    // Initiate M-Pesa STK Push payment and trigger the overlay modal
    const handlePaymentSubmit = (req) => {
        const isAlternate = useAlternatePhone[req.id];
        const targetPhone = isAlternate ? alternatePhones[req.id] : req.user?.phone;

        // Open the processing modal overlay
        setIsProcessingPayment(true);

        router.post(
            `/requests/${req.id}/pay`,
            { phone: targetPhone },
            {
                preserveScroll: true,
                onFinish: () => {
                    // Closes the modal once the HTTP response/redirect completes
                    setIsProcessingPayment(false);
                },
            }
        );
    };

    // Resolves semantic icons based on job category string
    const getCategoryIcon = (category) => {
        const cat = (category || '').toLowerCase();
        if (cat.includes('plumb')) return 'water_drop';
        if (cat.includes('elect')) return 'bolt';
        if (cat.includes('carpen')) return 'carpenter';
        if (cat.includes('paint')) return 'format_paint';
        return 'construction';
    };

    // Real-time tab badge metric calculations
    const counts = useMemo(() => {
        return {
            all: requests.length,
            active: requests.filter((r) =>
                ['pending', 'accepted', 'inspection', 'in_progress'].includes(r.status)
            ).length,
            action: requests.filter((r) =>
                ['price_pending_confirmation', 'awaiting_confirmation', 'awaiting_payment'].includes(r.status)
            ).length,
            completed: requests.filter((r) =>
                ['paid', 'completed'].includes(r.status)
            ).length,
        };
    }, [requests]);

    // Active dataset filtered by selected status category
    const filteredRequests = useMemo(() => {
        return requests.filter((req) => {
            if (activeTab === 'active') {
                return ['pending', 'accepted', 'inspection', 'in_progress'].includes(req.status);
            }
            if (activeTab === 'action') {
                return ['price_pending_confirmation', 'awaiting_confirmation', 'awaiting_payment'].includes(req.status);
            }
            if (activeTab === 'completed') {
                return ['paid', 'completed'].includes(req.status);
            }
            return true;
        });
    }, [requests, activeTab]);

    // Visual stepper tracker calculator
    const getStepState = (status) => {
        const stages = ['Requested', 'Inspected', 'Working', 'Completed'];
        let activeIndex = 0;
        let progressWidth = '25%';

        switch (status) {
            case 'pending':
            case 'accepted':
                activeIndex = 0;
                progressWidth = '25%';
                break;
            case 'inspection':
            case 'price_pending_confirmation':
                activeIndex = 1;
                progressWidth = '50%';
                break;
            case 'in_progress':
                activeIndex = 2;
                progressWidth = '75%';
                break;
            case 'awaiting_confirmation':
            case 'awaiting_payment':
                activeIndex = 2;
                progressWidth = '85%';
                break;
            case 'paid':
            case 'completed':
                activeIndex = 3;
                progressWidth = '100%';
                break;
            case 'declined':
            case 'cancelled':
                activeIndex = -1;
                progressWidth = '0%';
                break;
            default:
                activeIndex = 0;
                progressWidth = '25%';
        }

        return { stages, activeIndex, progressWidth };
    };

    return (
        <TenantLayout
            header={
                <div className="flex justify-between items-center w-full font-sans">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-sans text-gray-900 dark:text-white">
                            Repair &amp; Maintenance Tracker
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
                            Track your repairs from request to completion.
                        </p>
                    </div>
                    <Link
                        href="/requests/create"
                        className="inline-flex items-center gap-1.5 bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                        <Icon name="add" className="text-lg" />
                        <span>Create Request</span>
                    </Link>
                </div>
            }
        >
            <Head title="Repair &amp; Maintenance Tracker" />

            <div className="py-6 bg-[#f8fafc] dark:bg-gray-900 min-h-[calc(100vh-140px)] font-sans">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-6">

                    {/* Global Flash Alerts */}
                    {flash.error && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                            <Icon name="error" className="text-red-600 dark:text-red-400 text-xl shrink-0 mt-0.5" />
                            <div className="text-xs text-red-800 dark:text-red-300 font-medium">
                                <span className="font-bold block mb-0.5">Payment Failed</span>
                                {flash.error}
                            </div>
                        </div>
                    )}

                    {flash.success && (
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 flex items-start gap-3">
                            <Icon name="check_circle" className="text-green-600 dark:text-green-400 text-xl shrink-0 mt-0.5" />
                            <div className="text-xs text-green-800 dark:text-green-300 font-medium">
                                <span className="font-bold block mb-0.5">Success</span>
                                {flash.success}
                            </div>
                        </div>
                    )}

                    {/* Navigation Filter Tabs */}
                    <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-1 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-2.5 px-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
                                activeTab === 'all'
                                    ? 'text-[#004ac6] dark:text-blue-400 border-[#004ac6] dark:border-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            All ({counts.all})
                        </button>
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`pb-2.5 px-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
                                activeTab === 'active'
                                    ? 'text-[#004ac6] dark:text-blue-400 border-[#004ac6] dark:border-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Active ({counts.active})
                        </button>
                        <button
                            onClick={() => setActiveTab('action')}
                            className={`pb-2.5 px-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 relative ${
                                activeTab === 'action'
                                    ? 'text-[#004ac6] dark:text-blue-400 border-[#004ac6] dark:border-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Action Required ({counts.action})
                            {counts.action > 0 && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full animate-ping" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`pb-2.5 px-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
                                activeTab === 'completed'
                                    ? 'text-[#004ac6] dark:text-blue-400 border-[#004ac6] dark:border-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            Completed ({counts.completed})
                        </button>
                    </div>

                    {/* Empty State */}
                    {filteredRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center shadow-sm">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#004ac6] dark:text-blue-400 mb-3">
                                <Icon name="handyman" className="text-3xl" />
                            </div>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white">No repair tickets registered</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-1">
                                {activeTab !== 'all'
                                    ? 'There are no repair tickets matching your active filter tab.'
                                    : 'Launch your first repair breakdown entry from the portal.'}
                            </p>
                            <Link
                                href="/requests/create"
                                className="mt-4 bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
                            >
                                Create Repair Request
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredRequests.map((req) => {
                                const { stages, activeIndex, progressWidth } = getStepState(req.status);
                                const isActionCard = ['price_pending_confirmation', 'awaiting_confirmation', 'awaiting_payment'].includes(req.status);
                                const isCardExpanded = expandedCards[req.id] ?? isActionCard;

                                // Semantic Status Badge styling definitions
                                let statusPill = {
                                    bg: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                                    icon: 'info',
                                    label: req.status.replace(/_/g, ' '),
                                };

                                if (req.status === 'awaiting_payment') {
                                    statusPill = { bg: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300', icon: 'payments', label: 'Awaiting Payment' };
                                } else if (req.status === 'price_pending_confirmation') {
                                    statusPill = { bg: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300', icon: 'pending_actions', label: 'Quote Pending' };
                                } else if (req.status === 'inspection') {
                                    statusPill = { bg: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 animate-pulse', icon: 'search_check', label: 'Site Inspection' };
                                } else if (req.status === 'in_progress') {
                                    statusPill = { bg: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300', icon: 'engineering', label: 'In Progress' };
                                } else if (req.status === 'awaiting_confirmation') {
                                    statusPill = { bg: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300', icon: 'verified', label: 'Confirm Sign-off' };
                                } else if (req.status === 'paid' || req.status === 'completed') {
                                    statusPill = { bg: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-300', icon: 'check_circle', label: 'Paid & Closed' };
                                } else if (req.status === 'declined') {
                                    statusPill = { bg: 'bg-red-50 text-red-600 border border-red-200', icon: 'cancel', label: 'Declined' };
                                }

                                return (
                                    <div
                                        key={req.id}
                                        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all border ${
                                            isActionCard
                                                ? 'border-2 border-[#004ac6]/30 dark:border-blue-500/40'
                                                : 'border-gray-200 dark:border-gray-700/60'
                                        }`}
                                    >
                                        {/* Card Header (Clickable for expand/collapse) */}
                                        <div
                                            onClick={() => toggleExpand(req.id)}
                                            className={`p-6 border-b border-gray-100 dark:border-gray-700/50 cursor-pointer select-none transition-colors ${
                                                isActionCard
                                                    ? 'bg-blue-50/40 dark:bg-blue-950/20'
                                                    : 'hover:bg-gray-50/70 dark:hover:bg-gray-750'
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#004ac6] dark:text-blue-400 flex items-center justify-center shrink-0">
                                                        <Icon name={getCategoryIcon(req.category)} className="text-2xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {req.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            #{String(req.id).padStart(5, '0')} • {req.category}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 self-start sm:self-auto">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${statusPill.bg}`}>
                                                        <Icon name={statusPill.icon} className="text-sm" />
                                                        {statusPill.label}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label="Toggle details"
                                                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                    >
                                                        <Icon name={isCardExpanded ? 'expand_less' : 'expand_more'} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Step Progress Bar */}
                                            {activeIndex >= 0 && (
                                                <div className="mt-5 mb-1">
                                                    <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
                                                        {stages.map((stage, idx) => (
                                                            <span
                                                                key={stage}
                                                                className={
                                                                    idx === activeIndex
                                                                        ? 'text-[#004ac6] dark:text-blue-400 font-bold'
                                                                        : idx < activeIndex
                                                                        ? 'text-gray-700 dark:text-gray-300'
                                                                        : ''
                                                                }
                                                            >
                                                                {stage}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#004ac6] dark:bg-blue-500 rounded-full transition-all duration-300"
                                                            style={{ width: progressWidth }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Expandable Details Container */}
                                        {isCardExpanded && (
                                            <div className="p-6 bg-white dark:bg-gray-800 space-y-6">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    
                                                    {/* Left Column: Details & Contractor Summary */}
                                                    <div className="flex-1 space-y-4">
                                                        <div>
                                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                                                                Description
                                                            </h4>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                                {req.description}
                                                            </p>
                                                        </div>

                                                        {/* Metadata Attributes */}
                                                        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-xs">
                                                            <div>
                                                                <span className="text-gray-400 block">Location:</span>
                                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                                    {req.location}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400 block">Scheduled:</span>
                                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                                    {req.scheduled_date || 'Flexible schedule'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Assigned Contractor Card */}
                                                        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                                                                Assigned Specialist
                                                            </h4>
                                                            {req.contractor ? (
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#004ac6] dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                                                                            {req.contractor.name.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                                                {req.contractor.name}
                                                                            </p>
                                                                            <div className="flex items-center text-amber-500 gap-1 text-xs font-semibold">
                                                                                <Icon name="star" className="text-xs" filled />
                                                                                <span>Certified Artisan</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 italic">
                                                                    <Icon name="person_off" className="text-base" />
                                                                    <span>No contractor assigned yet</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Right Column: Contextual Action Handlers */}
                                                    <div className="flex-1 flex flex-col justify-center">

                                                        {/* Step Action: Price Pending Confirmation */}
                                                        {req.status === 'price_pending_confirmation' && (
                                                            <div className="bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl p-6 space-y-4">
                                                                <div className="flex justify-between items-center pb-3 border-b border-orange-200 dark:border-orange-900/40">
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                                                            Price Quote Submitted
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            Audited baseline quote based on site inspection.
                                                                        </p>
                                                                    </div>
                                                                    <Icon name="receipt_long" className="text-orange-600 text-3xl" />
                                                                </div>

                                                                <div className="flex flex-col items-center">
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Estimated Cost</span>
                                                                    <span className="text-3xl font-extrabold text-[#004ac6] dark:text-blue-400 mt-1">
                                                                        KES {Number(req.agreed_price).toLocaleString()}
                                                                    </span>
                                                                </div>

                                                                <button
                                                                    onClick={() => confirmPrice(req.id)}
                                                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <Icon name="lock_open" className="text-sm" />
                                                                    Confirm Price &amp; Authorize Repair
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Step Action: Awaiting Quality Sign-off */}
                                                        {req.status === 'awaiting_confirmation' && (
                                                            <div className="bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl p-6 space-y-4">
                                                                <div className="flex justify-between items-center pb-3 border-b border-purple-200 dark:border-purple-900/40">
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                                                            Contractor Sign-off
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            Work completed. Verify repair quality.
                                                                        </p>
                                                                    </div>
                                                                    <Icon name="task_alt" className="text-purple-600 text-3xl" />
                                                                </div>

                                                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                                                    The technician has marked physical work complete. Check your residential setup before moving to settlement.
                                                                </p>

                                                                <button
                                                                    onClick={() => confirm(req.id)}
                                                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-sm transition-all"
                                                                >
                                                                    Confirm Quality &amp; Proceed to Payment
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Step Action: Awaiting M-Pesa STK Settlement */}
                                                        {req.status === 'awaiting_payment' && (
                                                            <div className="bg-blue-50/40 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
                                                                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                                                            Payment Required
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            Review &amp; pay via Safaricom M-Pesa STK Push
                                                                        </p>
                                                                    </div>
                                                                    <Icon name="payments" className="text-[#004ac6] dark:text-blue-400 text-3xl" filled />
                                                                </div>

                                                                <div className="flex flex-col items-center">
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Amount Due</span>
                                                                    <span className="text-3xl font-extrabold text-[#004ac6] dark:text-blue-400 mt-1">
                                                                        KES {Number(req.agreed_price).toLocaleString()}
                                                                    </span>
                                                                </div>

                                                                {/* Interactive Phone Selector */}
                                                                <div className="space-y-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                                                    {/* Default: Registered Account MSISDN */}
                                                                    <label className="flex items-start gap-3 cursor-pointer">
                                                                        <input
                                                                            type="radio"
                                                                            name={`phone_mode_${req.id}`}
                                                                            checked={!useAlternatePhone[req.id]}
                                                                            onChange={() => setUseAlternatePhone({ ...useAlternatePhone, [req.id]: false })}
                                                                            className="mt-0.5 text-[#004ac6] focus:ring-[#004ac6]"
                                                                        />
                                                                        <div className="text-xs">
                                                                            <span className="font-bold text-gray-800 dark:text-gray-200 block">
                                                                                Pay using my registered number
                                                                            </span>
                                                                            <span className="font-mono text-gray-500 dark:text-gray-400 text-[11px]">
                                                                                📱 {req.user?.phone || 'No registered phone on file'}
                                                                            </span>
                                                                        </div>
                                                                    </label>

                                                                    {/* Custom MSISDN Input Option */}
                                                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                                                        <label className="flex items-center gap-3 cursor-pointer mb-2">
                                                                            <input
                                                                                type="radio"
                                                                                name={`phone_mode_${req.id}`}
                                                                                checked={!!useAlternatePhone[req.id]}
                                                                                onChange={() => setUseAlternatePhone({ ...useAlternatePhone, [req.id]: true })}
                                                                                className="text-[#004ac6] focus:ring-[#004ac6]"
                                                                            />
                                                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                Use a different M-Pesa number
                                                                            </span>
                                                                        </label>

                                                                        {useAlternatePhone[req.id] && (
                                                                            <div className="pl-6 pt-1 space-y-1">
                                                                                <input
                                                                                    type="text"
                                                                                    value={alternatePhones[req.id] || ''}
                                                                                    onChange={(e) =>
                                                                                        setAlternatePhones({
                                                                                            ...alternatePhones,
                                                                                            [req.id]: e.target.value,
                                                                                        })
                                                                                    }
                                                                                    placeholder="e.g. 0712345678 or 2547..."
                                                                                    className="w-full text-xs font-mono px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-[#004ac6]"
                                                                                />
                                                                                <span className="text-[10px] text-gray-400 block">
                                                                                    PIN prompt will be sent to this line.
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {errors.phone && (
                                                                        <p className="text-[11px] text-red-600 font-medium pt-1">
                                                                            ⚠️ {errors.phone}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Submit Payment Trigger Button */}
                                                                <button
                                                                    disabled={isProcessingPayment}
                                                                    onClick={() => handlePaymentSubmit(req)}
                                                                    className="w-full text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
                                                                    style={{ backgroundColor: 'rgb(22, 163, 74)' }}
                                                                >
                                                                    <Icon name="send_money" filled className="text-base" />
                                                                    <span>
                                                                        {isProcessingPayment ? 'Awaiting M-Pesa Gateway...' : 'Pay with M-Pesa'}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* In Progress Status Card */}
                                                        {req.status === 'in_progress' && (
                                                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center space-y-2">
                                                                <Icon name="engineering" className="text-4xl text-[#004ac6] dark:text-blue-400" />
                                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Work in Progress</h4>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    Contractor is currently completing the authorized repair work.
                                                                </p>
                                                                <div className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 mt-2">
                                                                    Locked Quote: KES {Number(req.agreed_price).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Job Completed & Settled Status */}
                                                        {(req.status === 'paid' || req.status === 'completed') && (
                                                            <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-xl p-6 flex flex-col items-center text-center space-y-3">
                                                                <Icon name="verified" className="text-3xl text-green-600 dark:text-green-400" filled />
                                                                <div>
                                                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                                                                        Payment Settled &amp; Request Closed
                                                                    </h4>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                        Disbursed amount: KES {Number(req.agreed_price).toLocaleString()}
                                                                    </p>
                                                                </div>

                                                                {!req.review ? (
                                                                    <button
                                                                        onClick={() => setSelectedRequestForReview(req)}
                                                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                                                                    >
                                                                        <Icon name="star" className="text-sm" filled />
                                                                        <span>Submit Feedback Review</span>
                                                                    </button>
                                                                ) : (
                                                                    <div className="text-xs font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
                                                                        ★ Rated: {req.review.rating} / 5 Stars
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Pending Unassigned Alert */}
                                                        {req.status === 'pending' && !req.contractor_id && (
                                                            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-4 space-y-3">
                                                                <p className="text-xs text-amber-800 dark:text-amber-400 font-medium flex items-center gap-1.5">
                                                                    <Icon name="warning" className="text-amber-600 text-base" />
                                                                    No specialist is currently assigned to this session.
                                                                </p>
                                                                <Link
                                                                    href={`/select-contractor/${req.id}`}
                                                                    className="inline-block w-full bg-[#004ac6] hover:bg-[#003ea8] text-white font-bold text-xs py-2 rounded-lg text-center transition-colors shadow-sm"
                                                                >
                                                                    Select Contractor
                                                                </Link>
                                                            </div>
                                                        )}

                                                        {/* Declined Warning */}
                                                        {req.status === 'declined' && (
                                                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl p-4 space-y-3">
                                                                <p className="text-xs text-red-700 dark:text-red-400 font-medium flex items-center gap-1.5">
                                                                    <Icon name="error" className="text-red-600 text-base" />
                                                                    The specialist was unable to book this job request.
                                                                </p>
                                                                <button
                                                                    onClick={() => changeContractor(req.id)}
                                                                    className="w-full bg-[#004ac6] hover:bg-[#003ea8] text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm"
                                                                >
                                                                    Select Alternate Specialist
                                                                </button>
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>

                                                {/* Cancellation Footer for Pre-execution States */}
                                                {['pending', 'accepted', 'inspection', 'price_pending_confirmation', 'declined'].includes(req.status) && (
                                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
                                                        <button
                                                            onClick={() => cancelRequest(req.id)}
                                                            className="text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3.5 py-1.5 rounded-lg transition-all border border-red-100 dark:border-red-900/30"
                                                        >
                                                            Cancel Ticket
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>

            {/* ================= POST-COMPLETION REVIEW MODAL ================= */}
            {selectedRequestForReview && (
                <ReviewModal
                    request={selectedRequestForReview}
                    onClose={() => setSelectedRequestForReview(null)}
                />
            )}

            {/* ================= ASYNCHRONOUS M-PESA PROCESSING MODAL ================= */}
            {isProcessingPayment && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mpesa-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 transition-all duration-200"
                >
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 text-center shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all scale-100">
                        
                        {/* Animated Processing Icon */}
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <span className="material-symbols-outlined text-3xl animate-bounce">
                                smartphone
                            </span>
                        </div>

                        {/* Title & User Guidance */}
                        <h3 
                            id="mpesa-modal-title" 
                            className="text-base font-bold text-gray-900 dark:text-white"
                        >
                            Payment Underway
                        </h3>
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            Sending STK Push prompt to your handset. Please check your screen and enter your M-Pesa PIN.
                        </p>

                        {/* Safaricom Live Pulse Indicator */}
                        <div className="mt-5 flex items-center justify-center gap-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 py-2.5 px-4 border border-gray-100 dark:border-gray-700">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Awaiting Safaricom Gateway...
                            </span>
                        </div>

                        {/* Dismissal Override */}
                        <button
                            type="button"
                            onClick={() => setIsProcessingPayment(false)}
                            className="mt-5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition underline underline-offset-2"
                        >
                            Cancel or close window
                        </button>
                    </div>
                </div>
            )}
        </TenantLayout>
    );
}