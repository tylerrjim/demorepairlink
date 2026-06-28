<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContractorRegisterController;
use App\Http\Controllers\Admin\ContractorApprovalController;
use App\Http\Controllers\RepairRequestController;
use App\Http\Controllers\ContractorSelectionController;
use App\Http\Controllers\PaymentController; 
use App\Http\Controllers\ReviewController;  
use App\Models\User; 

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Pages
|--------------------------------------------------------------------------
*/

// Home Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => true,
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Core Dashboard Redirect
|--------------------------------------------------------------------------
*/

// Main Dashboard Router (Checks user role and sends them to the right dashboard)
Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->role === 'tenant') {
        return Inertia::render('Dashboard');
    }

    if ($user->role === 'contractor') {
        return redirect()->route('contractor.dashboard');
    }

    if ($user->role === 'admin') {
        // Count pending contractors for the sidebar notification badge
        $pendingCount = User::where('role', 'contractor')
            ->where('status', 'pending')
            ->count();

        return Inertia::render('Admin/Dashboard', [
            'pending_approvals_count' => $pendingCount
        ]);
    }
})->middleware(['auth'])->name('dashboard');

// User Profile Settings (Edit, Update, Delete account)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
| Admin Routes (Contractor Approvals & Vetting)
|--------------------------------------------------------------------------     
*/

Route::middleware(['auth'])->group(function () {
    // View list of all approved contractors
    Route::get('/admin/contractors', [ContractorApprovalController::class, 'index'])
        ->name('admin.contractors.index');

    // View list of contractors waiting for approval
    Route::get('/admin/contractors/approvals', [ContractorApprovalController::class, 'approvals'])
        ->name('admin.contractors.approvals');

    // Approve a contractor's account
    Route::post('/admin/contractors/{user}/approve', [ContractorApprovalController::class, 'approve'])
        ->name('admin.contractors.approve');

    // Reject a contractor's account
    Route::post('/admin/contractors/{user}/reject', [ContractorApprovalController::class, 'reject'])
        ->name('admin.contractors.reject');
});

/*
| Contractor Registration
*/

// Signup pages for new contractors
Route::middleware('guest')->group(function () {
    Route::get('/register/contractor', [ContractorRegisterController::class, 'create'])
        ->name('contractor.register'); 
        
    Route::post('/register/contractor', [ContractorRegisterController::class, 'store'])
        ->name('contractor.store');    
});

/*
|--------------------------------------------------------------------------
| Tenant Routes (Repair Requests & Lifecycles)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    // View the tenant's own repair requests
    Route::get('/my-requests', [RepairRequestController::class, 'myRequests']);

    // Show the form to create a new repair request
    Route::get('/requests/create', function () {
        return Inertia::render('CreateRequest');
    });

    // Save a newly created repair request to the database
    Route::post('/requests', [RepairRequestController::class, 'store'])->name('requests.store');

    // Cancel a repair request
    Route::post('/requests/{id}/cancel', [RepairRequestController::class, 'cancel'])->name('requests.cancel');

    // Change or reset the contractor assigned to a request
    Route::post('/requests/{id}/change-contractor', [RepairRequestController::class, 'changeContractor']);

    // Show available contractors for a specific request
    Route::get('/select-contractor/{id}', [ContractorSelectionController::class, 'index']);

    // Assign a contractor to a request manually
    Route::post('/assign-contractor/{id}', [ContractorSelectionController::class, 'assign']);

    // Trigger M-Pesa STK Push payment using the Safaricom API
    Route::post('/requests/{id}/pay', [PaymentController::class, 'initiatePayment'])->name('payment.initiate');

    // Submit a review and rating for a contractor
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

/*
|--------------------------------------------------------------------------
| Contractor Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    // View the contractor's specific dashboard and available jobs
    Route::get('/contractor/dashboard', [RepairRequestController::class, 'contractorRequests'])
        ->name('contractor.dashboard');

    // Accept a job offer
    Route::post('/requests/{id}/accept', [RepairRequestController::class, 'accept'])
        ->name('requests.accept');

    // Decline a job offer
    Route::post('/requests/{id}/decline', [RepairRequestController::class, 'decline'])
        ->name('requests.decline');

    // Start the site inspection phase
    Route::post('/requests/{id}/start', [RepairRequestController::class, 'start'])
        ->name('requests.start');

    // Submit a price quote after inspection
    Route::post('/requests/{id}/submit-price', [RepairRequestController::class, 'submitPrice'])
        ->name('requests.submit-price');

    // Tenant confirms and accepts the proposed price
    Route::post('/requests/{id}/confirm-price', [RepairRequestController::class, 'confirmPrice'])
        ->name('requests.confirm-price');

    // Contractor confirms they are starting the actual repair work
    Route::post('/requests/{id}/confirm', [RepairRequestController::class, 'confirm'])
        ->name('requests.confirm');

    // Mark the entire repair job as completed
    Route::post('/requests/{id}/complete', [RepairRequestController::class, 'complete'])
        ->name('requests.complete');

    // Cancel or withdraw from an inspection before giving a price quote
    Route::post('/requests/{id}/withdraw', [RepairRequestController::class, 'withdrawFromInspection'])
        ->name('requests.withdraw');
});

// Load the default authentication routes (Login, Register, Logout from auth.php)
require __DIR__.'/auth.php';