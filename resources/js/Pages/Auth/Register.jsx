import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

// Universal Icon Wrapper
const Icon = ({ name, className = '' }) => (
    <span className={`material-symbols-outlined ${className}`}>
        {name}
    </span>
);

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '', // ✅ INITIALIZED STATE PROPERTY FOR THE USER CONTEXT
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans antialiased">
            <Head title="Register" />

            {/* ─── LEFT SIDE: PREMIUM SPLIT-SCREEN BRAND PANEL ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* Decorative background vectors for production style enhancement */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
                
                {/* Logo Section */}
                <div className="relative z-10 flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-white text-3xl font-bold">handshake</span>
                    <span className="font-black text-2xl tracking-wider">RepairLink</span>
                </div>

                {/* Central Focus Context */}
                <div className="relative z-10 max-w-md my-auto space-y-4">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                        Connecting You with Skilled Hands, Every Step of the Way.
                    </h2>
                    <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium opacity-90">
                        Create an account to access trusted repair services, manage your maintenance pipeline, and track job progress seamlessly from your workspace.
                    </p>
                </div>

                {/* Secure Gateway Footer Token */}
                <div className="relative z-10 text-xs text-blue-200/80 flex items-center gap-2 font-medium">
                    <Icon name="verified_user" className="text-sm text-blue-300" />
                    <span>Protected by end-to-end authentication layer policies.</span>
                </div>
            </div>

            {/* ─── RIGHT SIDE: CLEAN FORM INPUT CARD HUB ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-900 overflow-y-auto">
                <div className="w-full max-w-md space-y-6 py-8">
                    
                    {/* Header Headers & Back Navigation Row */}
                    <div>
                        {/* ✅ ADDED: Clean context-appropriate exit route matching Contractor view */}
                        <div className="flex items-center justify-between mb-6">
                            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                                <Icon name="arrow_back" className="text-sm" /> Back to Home
                            </Link>
                            <div className="flex lg:hidden items-center gap-1.5">
                                <span className="material-symbols-outlined text-blue-600 text-2xl font-bold">handshake</span>
                                <span className="font-black text-xl text-gray-900 dark:text-white tracking-wider">RepairLink</span>
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Create Account
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Join the system pipeline to coordinate or manage repairs.
                        </p>
                    </div>

                    {/* Content Registration Form */}
                    <form onSubmit={submit} className="space-y-4">
                        
                        {/* 1. Name Field */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="name" value="Full Name" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="person" className="text-lg" />
                                </div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors shadow-sm"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* 2. Email Field */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="email" value="Email Address" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="mail" className="text-lg" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors shadow-sm"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* 3. Phone Number Field */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="phone" value="Phone Number" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="phone" className="text-lg" />
                                </div>
                                <TextInput
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={data.phone}
                                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors shadow-sm"
                                    autoComplete="tel"
                                    placeholder="07XXXXXXXX"
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        {/* 4. Password Field */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="password" value="Password" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="lock" className="text-lg" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors shadow-sm"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* 5. Confirm Password Field */}
                        <div className="space-y-1.5">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                    <Icon name="lock_clock" className="text-lg" />
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors shadow-sm"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        {/* 6. Action Submit Trigger Button Row */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? 'Registering Account...' : 'Register'}
                                {!processing && <Icon name="app_registration" className="text-sm" />}
                            </button>
                        </div>
                    </form>

                    {/* 7. Redirection link back to the system login workspace entry */}
                    <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Already registered?{' '}
                            <Link
                                href={route('login')}
                                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}