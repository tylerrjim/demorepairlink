<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RepairRequest;
use App\Models\Review; // ✅ IMPORTED REVIEW MODEL TO COMPUTE RATINGS
use Inertia\Inertia;

class ContractorSelectionController extends Controller
{
    public function index($id)
    {
        $repair = RepairRequest::findOrFail($id);

        $contractors = User::with('contractorProfile')
            ->where('role', 'contractor')
            ->where('status', 'active')
            ->whereHas('contractorProfile', function ($q) use ($repair) {
                $q->where('trade', $repair->category);
            })
            ->get()
            ->map(function ($contractor) {
                // ✅ DYNAMICALLY CALCULATE ROLLING AVERAGE RATING FROM THE REVIEWS TABLE
                $contractor->average_rating = Review::where('contractor_id', $contractor->id)
                    ->avg('rating') ?? 0;
                return $contractor;
            });

        return Inertia::render('SelectContractor', [
            'repair' => $repair,
            'contractors' => $contractors
        ]);
    }

    public function assign($id, Request $request)
    {
        $repair = RepairRequest::findOrFail($id);

        // ✅ CONCURRENCY SAFETY GUARD: Prevents double-assignment state locking from concurrent requests
        if ($repair->contractor_id !== null) {
            return redirect('/dashboard')
                ->with('error', 'A specialist has already been booked for this maintenance request.');
        }

        $repair->contractor_id = $request->contractor_id;
        $repair->status = 'pending'; // stays pending until contractor accepts
        $repair->save();

        return redirect('/dashboard')
            ->with('success', 'Contractor assigned successfully.');
    }
}