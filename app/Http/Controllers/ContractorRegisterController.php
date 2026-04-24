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
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'contractor',
            'status' => 'pending'
        ]);

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
