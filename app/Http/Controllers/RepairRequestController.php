<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RepairRequest;
use Inertia\Inertia;

class RepairRequestController extends Controller
{
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
            'scheduled_date' => 'required|date',
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

    public function myRequests()
    {
        $requests = RepairRequest::with('contractor')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('MyRequests', [
            'requests' => $requests
        ]);
    }

    //FETCH CONTRACTOR JOBS
    public function contractorRequests()
    {
        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        $requests = \App\Models\RepairRequest::where('contractor_id', auth()->id())
            ->latest()
            ->get();

        return \Inertia\Inertia::render('Contractor/Dashboard', [
            'requests' => $requests
        ]);
    }

    //Accepting a request by contractor    
    public function accept($id)
    {
        $request = \App\Models\RepairRequest::findOrFail($id);

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

    //Starting a request by contractor
    public function start($id)
    {
        $request = RepairRequest::findOrFail($id);

        // Only contractor
        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        // Must be assigned contractor
        if ($request->contractor_id !== auth()->id()) {
            abort(403);
        }

        // Only start if accepted
        if ($request->status !== 'accepted') {
            return back();
        }

        $request->status = 'in_progress';
        $request->save();

        return back();
    }

    //Declining a request by contractor
    public function decline($id)
    {
        $request = \App\Models\RepairRequest::findOrFail($id);

        if (auth()->user()->role !== 'contractor') {
            abort(403);
        }

        if ($request->contractor_id !== auth()->id()) {
            abort(403);
        }

        $request->status = 'declined';
        $request->contractor_id = null;
        $request->save();

        return back();
    }

    //Completing a request by contractor
    public function complete($id)
    {
        $request = \App\Models\RepairRequest::findOrFail($id);

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

    //Confirming completion by tenant
    public function confirm($id)
    {
        $request = RepairRequest::findOrFail($id);

        // Only tenant who created request
        if ($request->user_id !== auth()->id()) {
            abort(403);
        }

        // Only confirm if awaiting confirmation
        if ($request->status !== 'awaiting_confirmation') {
            return back();
        }

        $request->status = 'completed';
        $request->save();

        return back();
    }
}
