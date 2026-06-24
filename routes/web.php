<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContractorRegisterController;
use App\Http\Controllers\Admin\ContractorApprovalController;
use App\Http\Controllers\RepairRequestController;
use App\Http\Controllers\ContractorSelectionController;
use App\Http\Controllers\PaymentController; // ✅ IMPORTED PAYMENT CONTROLLER
use App\Http\Controllers\ReviewController;  // ✅ IMPORTED REVIEW CONTROLLER
use App\Models\User; // ✅ IMPORTED USER FOR DASHBOARD REAL-TIME COUNTS

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Landing page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => true,
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard
Route::get('/dashboard', function () {

    $user = auth()->user();

    if ($user->role === 'tenant') {
        return Inertia::render('Dashboard'); // existing
    }

    if ($user->role === 'contractor') { // Newly added
        return redirect()->route('contractor.dashboard');
    }

    if ($user->role === 'admin') {
        // ✅ FETCH REAL-TIME COUNT TO PREVENT BLANK SIDEBAR NOTIFICATION BUBBLES
        $pendingCount = User::where('role', 'contractor')
            ->where('status', 'pending')
            ->count();

        return Inertia::render('Admin/Dashboard', [
            'pending_approvals_count' => $pendingCount
        ]);
    }

})->middleware(['auth'])->name('dashboard');

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth'])->group(function () {
    // 1. Give the index route a name (Loads ContractorsList.jsx)
    Route::get('/admin/contractors', [ContractorApprovalController::class, 'index'])
        ->name('admin.contractors.index');

    // ✅ Dedicated Route mapping for the verification workspace queue (Loads ContractorApproval.jsx)
    Route::get('/admin/contractors/approvals', [ContractorApprovalController::class, 'approvals'])
        ->name('admin.contractors.approvals');

    // 2. Add the approve name
    Route::post('/admin/contractors/{user}/approve', [ContractorApprovalController::class, 'approve'])
        ->name('admin.contractors.approve');

    // 3. Add the reject name
    Route::post('/admin/contractors/{user}/reject', [ContractorApprovalController::class, 'reject'])
        ->name('admin.contractors.reject');
});

// Contractor registration
Route::middleware('guest')->group(function () {
    // Corrected to use string class syntax to match your existing pattern
    Route::get('/register/contractor', [ContractorRegisterController::class, 'create'])
        ->name('contractor.register'); 
        
    Route::post('/register/contractor', [ContractorRegisterController::class, 'store'])
        ->name('contractor.store');    
});

// Repair requests
Route::middleware(['auth'])->group(function () {
    // Modified destination syntax structure parameters
    Route::post('/requests', [RepairRequestController::class, 'store'])->name('requests.store');
});

// Create request page
Route::get('/requests/create', function () {
    return Inertia::render('CreateRequest');
})->middleware('auth');

// Contractor selection
Route::get('/select-contractor/{id}', [ContractorSelectionController::class, 'index'])
    ->middleware('auth');

Route::post('/assign-contractor/{id}', [ContractorSelectionController::class, 'assign'])
    ->middleware('auth');

// Contractor routes
Route::middleware(['auth'])->group(function () {

    Route::get('/contractor/dashboard', [RepairRequestController::class, 'contractorRequests'])
        ->name('contractor.dashboard');

    Route::post('/requests/{id}/accept', [RepairRequestController::class, 'accept'])
        ->name('requests.accept');

    Route::post('/requests/{id}/decline', [RepairRequestController::class, 'decline'])
        ->name('requests.decline');

    Route::post('/requests/{id}/complete', [RepairRequestController::class, 'complete'])
        ->name('requests.complete');

    Route::post('/requests/{id}/start', [RepairRequestController::class, 'start'])
        ->name('requests.start');

    Route::post('/requests/{id}/confirm', [RepairRequestController::class, 'confirm'])
        ->name('requests.confirm');

    // NEW WORKFLOW ROUTE: Contractor proposes inspection price
    Route::post('/requests/{id}/submit-price', [RepairRequestController::class, 'submitPrice'])
        ->name('requests.submit-price');

    // NEW WORKFLOW ROUTE: Tenant confirms price to start work
    Route::post('/requests/{id}/confirm-price', [RepairRequestController::class, 'confirmPrice'])
        ->name('requests.confirm-price');

    // ✅ ADDED FEATURE ROUTE: Handles contractor backing out during inspection/acceptance lifecycle phases
    Route::post('/requests/{id}/withdraw', [RepairRequestController::class, 'withdrawFromInspection'])
        ->name('requests.withdraw');
});

// Displaying tenants requests
Route::get('/my-requests', [RepairRequestController::class, 'myRequests'])
    ->middleware(['auth']);

// Cancelling a request
Route::post('/requests/{id}/cancel', [RepairRequestController::class, 'cancel'])
    ->middleware(['auth'])
    ->name('requests.cancel');

// Handles resetting a contractor relationship when a tenant clicks 
Route::post('/requests/{id}/change-contractor', [RepairRequestController::class, 'changeContractor'])
    ->middleware(['auth']);

// End point triggering the M-Pesa STK Push
Route::post('/requests/{id}/pay', [PaymentController::class, 'initiatePayment'])
    ->middleware(['auth'])
    ->name('payment.initiate');

// ✅ ADDED FOR STEP 3: Route to store contractor feedback reviews
Route::post('/reviews', [ReviewController::class, 'store'])
    ->middleware(['auth'])
    ->name('reviews.store');

require __DIR__.'/auth.php';