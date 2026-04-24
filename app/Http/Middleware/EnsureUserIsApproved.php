<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {

            $user = Auth::user();

            if ($user->role === 'contractor' && $user->status === 'pending') {

                if ($request->routeIs('dashboard')) {

                    Auth::logout();

                    return redirect('/login')
                        ->with('error', 'Your account is awaiting admin approval.');
                }
            }
        }

        return $next($request);
    }
}