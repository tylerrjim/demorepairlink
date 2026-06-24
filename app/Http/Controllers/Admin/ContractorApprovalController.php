<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class ContractorApprovalController extends Controller
{
    /**
     * 1. Display the Full Registry of Approved Contractors
     * Matches frontend path: /admin/contractors
     */
    public function index()
    {
        // Fetch ALL contractors so the ContractorsList file can filter or view them cleanly
        $contractors = User::where('role', 'contractor')->get();

        // Calculate the count of pending profiles to update the sidebar's red counter badge dynamically
        $pendingCount = User::where('role', 'contractor')
            ->where('status', 'pending')
            ->count();

        return Inertia::render('Admin/ContractorsList', [
            'contractors' => $contractors,
            'pending_approvals_count' => $pendingCount
        ]);
    }

    /**
     * 2. Display the Pending Vetting/Onboarding Queue exclusively
     * Matches frontend path: /admin/contractors/approvals
     */
    public function approvals()
    {
        // Fetch only the applicants waiting for admin verification
        $pendingContractors = User::where('role', 'contractor')
            ->where('status', 'pending')
            ->get();

        // ✅ INJECTED: Keep sidebar notification bubble active when navigating onto this queue view
        $pendingCount = User::where('role', 'contractor')
            ->where('status', 'pending')
            ->count();

        return Inertia::render('Admin/ContractorApproval', [
            'contractors' => $pendingContractors,
            'pending_approvals_count' => $pendingCount
        ]);
    }

    /**
     * 3. Handle Onboarding Authorization
     * Safe string parameters mapped directly to your database ENUM constraints.
     */
    public function approve(User $user)
    {
        // ✅ FIXED: Changed from 'approved' back to 'active' to resolve your SQL 1265 truncation error
        $user->status = 'active'; 
        $user->save();

        return redirect()->back();
    }

    /**
     * 4. Handle Profile Rejection
     */
    public function reject(User $user)
    {
        $user->status = 'rejected';
        $user->save();

        return redirect()->back();
    }
}