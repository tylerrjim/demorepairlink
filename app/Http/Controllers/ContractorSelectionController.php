<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RepairRequest;
use App\Models\Review;
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
                // Calculate the average rating for each contractor and attach it as a property
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

        // Ensure that the repair request is still pending and has not been assigned yet
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