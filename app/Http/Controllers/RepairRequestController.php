<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RepairRequest;
use App\Models\Review; // ✅ IMPORTED REVIEW MODEL
use Inertia\Inertia;

class RepairRequestController extends Controller
{
    /**
     * Store a newly created repair request and redirect to contractor selection.
     */
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'tenant') {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'location' => 'required',
            // ✅ FIXED: Enforces that the selected date must be today or a future date
            'scheduled_date' => 'required|date|after_or_equal:today',
        ]);

        $repair = RepairRequest::create([
            'user_id' => auth()->id(),
            'title' => $data['title'],
            'description' => $data['description'],
            'location' => $request->location,
            'scheduled_date' => $request->scheduled_date,
            'category' => $data['category'],
            'status' => 'pending',
        ]);

        return redirect("/select-contractor/{$repair->id}");
    }

    /**
     * Fetch all repair requests submitted by the currently authenticated tenant.
     */
    public function myRequests()
    {
        // Added 'review' relation to the eager-loading array to track feedback status
        $requests = RepairRequest::with(['contractor', 'user', 'review'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('MyRequests', [
            'requests' => $requests
        ]);
    }

    /**
     * Fetch all repair requests assigned to the currently authenticated contractor.
     */
    public function contractorRequests()
    {
        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        // 1. Fetch requests assigned to this contractor
        $requests = RepairRequest::with('user')
            ->where('contractor_id', auth()->id())
            ->latest()
            ->get();

        // 2. ✅ UPDATED FOR STEP 5: Fetch reviews left by tenants with their corresponding user rows
        $reviews = Review::with('tenant')
            ->where('contractor_id', auth()->id())
            ->latest()
            ->get();

        // 3. ✅ UPDATED FOR STEP 5: Render the dashboard workspace view passing all critical aggregate indicators
        return Inertia::render('Contractor/Dashboard', [
            'requests'       => $requests,
            'reviews'        => $reviews,
            'average_rating' => auth()->user()->average_rating // Calculates rolling score from User model accessor
        ]);
    }

    /**
     * Accept a request by the assigned contractor.
     */
    public function accept($id)
    {
        $request = RepairRequest::findOrFail($id);

        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        if ($request->contractor_id !== auth()->id()) {
            abort(403);
        }

        $request->status = 'accepted';
        $request->save();

        return back();
    }

    /**
     * Contractor signals they have arrived or started the technical site inspection.
     */
    public function start($id)
    {
        $request = RepairRequest::findOrFail($id);

        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        if ($request->contractor_id !== auth()->id()) {
            abort(403);
        }

        if ($request->status !== 'accepted') {
            return back();
        }

        $request->status = 'inspection';
        $request->save();

        return back();
    }

    /**
     * Contractor submits the post-inspection agreed price.
     */
    public function submitPrice(Request $request, $id)
    {
        $repair = RepairRequest::findOrFail($id);

        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        if ($repair->contractor_id !== auth()->id()) {
            abort(403);
        }

        if ($repair->status !== 'inspection') {
            return back();
        }

        $request->validate([
            'agreed_price' => 'required|numeric|min:1'
        ]);

        $repair->agreed_price = $request->agreed_price;
        $repair->status = 'price_pending_confirmation';
        $repair->save();

        return back();
    }

    /**
     * Tenant reviews and confirms the proposed repair price.
     */
    public function confirmPrice($id)
    {
        $repair = RepairRequest::findOrFail($id);

        if ($repair->user_id !== auth()->id()) {
            abort(403);
        }

        if ($repair->status !== 'price_pending_confirmation') {
            return back();
        }

        $repair->price_confirmed_at = now();
        $repair->status = 'in_progress';
        $repair->save();

        return back();
    }

    /**
     * Decline a request by the contractor.
     */
    public function decline($id)
    {
        $request = RepairRequest::findOrFail($id);

        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        if ($request->contractor_id !== auth()->id()) {
            abort(403);
        }

        $request->status = 'declined';
        $request->save();

        return back();
    }

    /**
     * Mark work as finished by contractor; awaits confirmation from tenant.
     */
    public function complete($id)
    {
        $request = RepairRequest::findOrFail($id);

        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        if ($request->contractor_id !== auth()->id()) {
            abort(403);
        }

        if ($request->status !== 'in_progress') {
            return back();
        }

        $request->status = 'awaiting_confirmation';
        $request->save();

        return back();
    }

    /**
     * Cancel a request entirely by the tenant (Only allowed before work begins).
     */
    public function cancel($id)
    {
        $request = RepairRequest::findOrFail($id);

        if ($request->user_id !== auth()->id()) {
            abort(403);
        }

        if (
            $request->status !== 'pending' &&
            $request->status !== 'accepted' &&
            $request->status !== 'inspection' &&
            $request->status !== 'price_pending_confirmation' &&
            $request->status !== 'declined'
        ) {
            return back();
        }

        $request->status = 'cancelled';
        $request->save();

        return back();
    }

    /**
     * Confirm job completion by tenant.
     * Advances state to 'awaiting_payment' instead of sealing the job early.
     */
    public function confirm($id)
    {
        $request = RepairRequest::findOrFail($id);

        if ($request->user_id !== auth()->id()) {
            abort(403);
        }

        if ($request->status !== 'awaiting_confirmation') {
            return back();
        }

        $request->status = 'awaiting_payment';
        $request->save();

        return back();
    }

    /**
     * Release declined contractor and return the tenant to the selection screen.
     */
    public function changeContractor($id)
    {
        $request = RepairRequest::findOrFail($id);

        if ($request->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($request->status !== 'declined') {
            return back();
        }

        $request->update([
            'contractor_id' => null,
            'status' => 'pending'
        ]);

        return redirect("/select-contractor/{$request->id}");
    }

    /**
     * ✅ NEW FEATURE: Handle a contractor backing out/withdrawing during the live site inspection phase.
     * Reverts the system ticket back to public pending status pools for tenant re-selection.
     */
    public function withdrawFromInspection($id)
    {
        $request = RepairRequest::findOrFail($id);

        if (auth()->user()->role !== 'contractor') {
            abort(403, 'Unauthorized role access.');
        }

        if ($request->contractor_id !== auth()->id()) {
            abort(403, 'Unauthorized relationship constraint.');
        }

        // Only allow withdrawal before a final price binding contract is locked in progress
        if ($request->status === 'accepted' || $request->status === 'inspection') {
            $request->update([
                'contractor_id' => null,     // Detach contractor mapping index
                'status'        => 'pending' // Bounce back to open queue pools
            ]);

            return back()->with('success', 'Workspace session closed. Request returned to open pools.');
        }

        return back()->with('error', 'Action unauthorized under current lifecycle parameters.');
    }
}