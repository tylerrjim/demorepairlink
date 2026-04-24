<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class ContractorApprovalController extends Controller
{
    public function index()
    {
        $contractors = User::where('role', 'contractor')
            ->where('status', 'pending')
            ->get();

        return Inertia::render('Admin/ContractorApproval', [
            'contractors' => $contractors
        ]);
    }

    public function approve(User $user)
    {
        $user->status = 'active';
        $user->save();
        return redirect()->back();
    }

    public function reject(User $user)
    {
        $user->status = 'rejected';
        $user->save();

        return redirect()->back();
    }
}