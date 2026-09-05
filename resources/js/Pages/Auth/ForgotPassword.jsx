import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <span className="material-symbols-outlined text-2xl">handshake</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Forgot Password?
                </h2>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    Enter your registered account email to receive a password reset link.
                </p>
            </div>

            {status && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3 text-xs font-medium text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="email" 
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                        Email Address
                    </label>

                    <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                            <span className="material-symbols-outlined text-lg">mail</span>
                        </span>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-900"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <InputError message={errors.email} className="mt-1.5 text-xs" />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center rounded-xl bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                        disabled={processing}
                    >
                        {processing ? 'Sending Link...' : 'Email Password Reset Link'}
                    </PrimaryButton>
                </div>

                <div className="mt-4 text-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        <span>Back to Login</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}