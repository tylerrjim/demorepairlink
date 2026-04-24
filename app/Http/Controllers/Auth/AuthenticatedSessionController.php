<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 1. Check if email and password are correct
        $request->authenticate();

        // 2. Capture the user that just logged in
        $user = auth()->user();

        // 3. THE SECURITY GATE: Check if they are a pending contractor
        if ($user->role === 'contractor' && $user->status !== 'active') {
            
            // Log them out immediately so the session is destroyed
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Send them back to the login page with an error message
            return redirect()->route('login')->withErrors([
                'email' => 'Your account is pending admin approval. You will be able to login once approved.',
            ]);
        }

        // 4. If they pass the check (Admin, Tenant, or Approved Contractor)
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
