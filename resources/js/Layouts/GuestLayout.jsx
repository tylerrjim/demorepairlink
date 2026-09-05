export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-slate-50 dark:bg-slate-950">
            {/* The top logo block has been removed from here */}

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white dark:bg-slate-900 shadow-xl border border-slate-200/80 dark:border-slate-800 sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}