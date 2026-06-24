<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RepairRequest;
use App\Models\Review;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate incoming data payloads strictly
        $validated = $request->validate([
            'repair_request_id' => 'required|exists:repair_requests,id',
            'rating'            => 'required|integer|min:1|max:5',
            'review'            => 'nullable|string|max:1000',
        ]);

        // 2. Fetch the specific repair request to verify ownership
        $repairRequest = RepairRequest::findOrFail($validated['repair_request_id']);

        // Security Check: Guard to ensure only the tenant who owns the request can rate it
        if ($repairRequest->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action. You can only rate your own repair requests.');
        }

        // State Check: Guard to prevent duplicate reviews for the same request
        if ($repairRequest->review()->exists()) {
            return back()->with('error', 'You have already submitted a review for this repair request.');
        }

        // 3. Create and store the normalized review record
        Review::create([
            'repair_request_id' => $repairRequest->id,
            'tenant_id'         => auth()->id(),
            'contractor_id'     => $repairRequest->contractor_id,
            'rating'            => $validated['rating'],
            'review'            => $validated['review'],
        ]);

        // 4. Cleanly redirect back to the dashboard with an Inertia session flash message
        return back()->with('success', 'Thank you! Your feedback has been recorded successfully.');
    }
}