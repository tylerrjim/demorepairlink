<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ContractorProfile;
use Illuminate\Support\Facades\Hash;

class ContractorRegisterController extends Controller
{
    public function create()
    {
        return inertia('Auth/ContractorRegister');
    }

    public function store(Request $request)
    {
        // 1. Validate the incoming request parameters and file payload constraints
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string',
            'trade' => 'required|string|in:plumbing,electrical', // Restricts to your updated scope items
            'years_of_experience' => 'required|integer|min:0',
            'cv' => 'required|mimes:pdf|max:2048', // Enforces PDF format files up to 2MB (2048 KB)
        ]);

        // 2. Process and write the file payload stream out onto the server's local storage folder
        // Saves to storage/app/public/cvs/ and returns a relative string path pointer
        $path = $request->file('cv')->store('cvs', 'public');

        // 3. Persist the core User identity record mapping the file storage string pointer path
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'contractor',
            'status' => 'pending',
            'cv_path' => $path // ✅ Persists the text reference path to the database users table layout
        ]);

        // 4. Create the nested relational Contractor Profile breakdown
        ContractorProfile::create([
            'user_id' => $user->id,
            'phone' => $request->phone,
            'trade' => $request->trade,
            'years_of_experience' => $request->years_of_experience
        ]);

        return redirect('/login')
            ->with('message', 'Your contractor account is pending admin approval.');
    }
}