<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RepairRequest;
use Inertia\Inertia;
class ContractorSelectionController extends Controller
{
    public function index($id)
{
    $repair = RepairRequest::findOrFail($id);

    $contractors = User::with('contractorProfile') // 👈 ADD THIS
    ->where('role', 'contractor')
    ->where('status', 'active')
    ->whereHas('contractorProfile', function ($q) use ($repair) {
        $q->where('trade', $repair->category);
    })
    ->get();

    return Inertia::render('SelectContractor', [
        'repair' => $repair,
        'contractors' => $contractors
    ]);
}

    public function assign($id, Request $request)
{
    $repair = RepairRequest::findOrFail($id);

    $repair->contractor_id = $request->contractor_id;
    $repair->status = 'pending'; // stays pending until contractor accepts
    $repair->save();

    return redirect('/dashboard')
        ->with('success', 'Contractor assigned successfully.');
}
}
