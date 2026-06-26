import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
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

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans antialiased">
            <Head title="Log In" />

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
                        Sign in to access trusted repair services, manage your maintenance pipeline, and track job progress seamlessly from your workspace.
                    </p>
                </div>

                {/* Secure Gateway Footer Token */}
                <div className="relative z-10 text-xs text-blue-200/80 flex items-center gap-2 font-medium">
                    <Icon name="verified_user" className="text-sm text-blue-300" />
                    <span>Protected by end-to-end authentication layer policies.</span>
                </div>
            </div>

            {/* ─── RIGHT SIDE: CLEAN FORM INPUT CARD HUB ─── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-900">
                <div className="w-full max-w-md space-y-8">
                    
                    {/* Header Headers & Back Navigation Row */}
                    <div>
                        {/* ✅ ADDED: Clean context-appropriate exit route matching Register view */}
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
                            Welcome Back
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Enter your credentials to access your maintenance pipeline.
                        </p>
                    </div>

                    {status && (
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-sm font-medium text-green-600 dark:text-green-400 rounded-xl">
                            {status}
                        </div>
                    )}

                    {/* Content Credentials Form */}
                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* 1. Email Box Row */}
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
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@example.com"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* 2. Password Box Row */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <InputLabel htmlFor="password" value="Password" className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
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
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* 3. Keep Logged In Checkbox State */}
                        <div className="flex items-center">
                            <label className="flex items-center group cursor-pointer">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                lock/>
                                <span className="ms-2 text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors select-none">
                                    Keep me signed in
                                </span>
                            </label>
                        </div>

                        {/* 4. Action Request Form Submit Toggle */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? 'Authenticating...' : 'Sign In'}
                                {!processing && <Icon name="arrow_forward" className="text-sm" />}
                            </button>
                        </div>
                    </form>

                    {/* 5. Alternate Onboarding Redirect Link */}
                    <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            New to our system?{' '}
                            <Link
                                href={route('register')}
                                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}