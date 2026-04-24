import React from 'react';
import { Link, Head } from '@inertiajs/react';

const Welcome = ({ auth }) => {
    return (
        <div className="bg-white font-sans text-gray-900 overflow-x-hidden">
            <Head title="RepairLink - Modern Home Repair Connection" />

            {/* BEGIN: Navigation */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-[#0056b3]">
                                Repair<span className="text-[#28a745]">Link</span>
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm font-semibold text-[#0056b3] px-3 py-2"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-semibold text-[#0056b3] px-3 py-2"
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* BEGIN: Hero Section */}
            <header className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1a202c] mb-6">
                        RepairLink
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
                        Connect with trusted contractors to solve home repair issues quickly and efficiently. 
                        The seamless bridge between property needs and professional solutions.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
                        <Link
                            href={route('register', { role: 'tenant' })}
                            className="w-full sm:w-auto px-8 py-4 bg-[#0056b3] text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                        >
                            Register as Tenant
                        </Link>
                        <Link
                            href={route('contractor.register', { role: 'contractor' })}
                            className="w-full sm:w-auto px-8 py-4 border-2 border-[#28a745] text-[#28a745] font-bold rounded-lg hover:bg-green-50 transition-colors duration-200 text-center"
                        >
                            Register as Contractor
                        </Link>
                    </div>
                </div>
                
                {/* Subtle Background Element */}
                <div className="absolute top-0 right-0 -z-10 opacity-10">
                    <svg fill="none" height="400" viewBox="0 0 400 400" width="400">
                        <circle className="text-[#0056b3]" cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2"></circle>
                    </svg>
                </div>
            </header>

            {/* BEGIN: How It Works Section */}
            <section className="py-16 bg-gray-50" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#1a202c]">How It Works</h2>
                        <div className="w-16 h-1 bg-[#28a745] mx-auto mt-4 rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <StepCard number="01" title="Submit Request" description="Tenant describes the issue, adds photos, and submits a repair ticket instantly." />
                        <StepCard number="02" title="Job Accepted" description="Verified contractors receive notifications and accept the job based on their availability." />
                        <StepCard number="03" title="Repair Completed" description="The contractor finishes the work, and the status is updated to complete in real-time." />
                    </div>
                </div>
            </section>

            {/* BEGIN: Benefits Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a202c]">Why Choose RepairLink?</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <BenefitCard 
                            title="Verified contractors" 
                            description="Rigorous background checks to ensure quality and safety."
                            icon={<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                        />
                        <BenefitCard 
                            title="Fast response" 
                            description="Most repairs are picked up within minutes of submission."
                            icon={<path d="M13 10V3L4 14h7v7l9-11h-7z" />}
                        />
                        <BenefitCard 
                            title="Easy job management" 
                            description="Track history, updates, and feedback all in one dashboard."
                            icon={<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />}
                        />
                        <BenefitCard 
                            title="Secure communication" 
                            description="In-app messaging keeps your personal data private."
                            icon={<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                        />
                    </div>
                </div>
            </section>

            {/* BEGIN: Footer CTA */}
            <footer className="bg-[#1a202c] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                    <p className="text-gray-400 mb-10">Join thousands of users simplifying their home maintenance today.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link href={route('register', { role: 'tenant' })} className="w-full sm:w-auto px-10 py-4 bg-[#0056b3] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                            Register as Tenant
                        </Link>
                        <Link href={route('contractor.register', { role: 'contractor' })} className="w-full sm:w-auto px-10 py-4 bg-[#28a745] text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                            Register as Contractor
                        </Link>
                    </div>
                    <div className="mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© 2026 RepairLink Inc. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
                            <a className="hover:text-white transition-colors" href="#">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Components for Cleanliness
const StepCard = ({ number, title, description }) => (
    <div className="flex flex-col items-center text-center px-4">
        <div className="text-6xl font-black mb-4" style={{ WebkitTextStroke: '1px #0056b3', color: 'transparent' }}>
            {number}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const BenefitCard = ({ title, description, icon }) => (
    <div className="p-8 border border-gray-100 rounded-2xl bg-white hover:border-[#0056b3]/30 transition-all shadow-sm hover:shadow-md">
        <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-lg mb-6">
            <svg className="w-6 h-6 text-[#0056b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icon}
            </svg>
        </div>
        <h4 className="text-lg font-bold mb-2">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

export default Welcome;