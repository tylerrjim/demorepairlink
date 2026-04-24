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
}
