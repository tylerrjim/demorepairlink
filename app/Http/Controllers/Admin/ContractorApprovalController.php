<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\ContractorApprovedNotification;
use App\Notifications\ContractorRejectedNotification;
use Inertia\Inertia;

class ContractorApprovalController extends Controller
{
    /**
     * 1. Display the Full Registry of Approved Contractors
     * Matches frontend path: /admin/contractors
     */
    public function index()
    {
        // ✅ FIXED: Added with('contractorProfile') so the list can access nested profile information
        $contractors = User::where('role', 'contractor')
            ->with('contractorProfile')
            ->get();

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
        // ✅ FIXED: Eager load the 'contractorProfile' relationship so all data is available
        // This ensures 'cv_path' from users table and trade/phone from profiles table are bound together
        $pendingContractors = User::where('role', 'contractor')
            ->where('status', 'pending')
            ->with('contractorProfile')
            ->get();

        // Keep sidebar notification bubble active when navigating onto this queue view
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
        // Changed from 'approved' back to 'active' to resolve your SQL 1265 truncation error
        $user->status = 'active'; 
        $user->save();

        // Dispatch approval email to the contractor
        $user->notify(new ContractorApprovedNotification());

        return redirect()->back();
    }

    /**
     * 4. Handle Profile Rejection
     */
    public function reject(User $user)
    {
        $user->status = 'rejected';
        $user->save();

        // Dispatch rejection email to the contractor
        $user->notify(new ContractorRejectedNotification());

        return redirect()->back();
    }
}