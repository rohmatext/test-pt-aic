<?php

use App\Http\Controllers\AdditionalFeeController;
use App\Http\Controllers\AuthenticationSessionController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\ProjectTaskController;
use App\Http\Controllers\RemunerationController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/me', function (Request $request) {
    return $request->user()->load('roles');
})->middleware('auth:sanctum');

Route::post('/login', [AuthenticationSessionController::class, 'store']);
Route::middleware('auth:sanctum')
    ->delete('/logout', [AuthenticationSessionController::class, 'destroy']);

Route::middleware(['auth:sanctum'])->prefix('users')->name('users.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index')->middleware('role:admin|manager');
    Route::post('/', [UserController::class, 'store'])->name('store')->middleware('role:admin');
    Route::get('/{user}', [UserController::class, 'show'])->name('show')->middleware('role:admin');
    Route::patch('/{user}', [UserController::class, 'update'])->name('update')->middleware('role:admin');
    Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy')->middleware('role:admin');
});

Route::middleware(['auth:sanctum'])->prefix('projects')->name('projects.')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('index');
    Route::get('/{project}', [ProjectController::class, 'show'])->name('show');

    Route::middleware('role:admin|manager')->group(function () {
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::patch('/{project}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');
        Route::patch('/{project}/status', [ProjectController::class, 'updateStatus'])->name('update.status');
    });

    Route::prefix('{project}/members')->name('members.')->group(function () {
        Route::get('/', [ProjectMemberController::class, 'index'])->name('index');

        Route::middleware('role:admin|manager')->group(function () {
            Route::post('/', [ProjectMemberController::class, 'store'])->name('store');
            Route::delete('/', [ProjectMemberController::class, 'destroy'])->name('destroy');
        });
    });

    Route::prefix('{project}/tasks')->name('tasks.')->group(function () {
        Route::get('/', [ProjectTaskController::class, 'index'])->name('index');
        Route::get('/{task}', [ProjectTaskController::class, 'show'])->name('show');
        Route::post('/', [ProjectTaskController::class, 'store'])->name('store')->middleware('role:employee');
        Route::patch('/{task}', [ProjectTaskController::class, 'update'])->name('update')->middleware('role:admin|manager');
        Route::delete('/{task}', [ProjectTaskController::class, 'destroy'])->name('destroy')->middleware('role:admin');
    })->scopeBindings();

    Route::prefix('{project}/remunerations')->name('remunerations.')->group(function () {
        Route::get('/', [RemunerationController::class, 'index'])->name('index');
    });
});

Route::middleware('auth:sanctum')->prefix('additional-fees')->name('additional-fees.')->group(function () {
    Route::get('/', [AdditionalFeeController::class, 'index'])->name('index');
    Route::post('/', [AdditionalFeeController::class, 'store'])->name('store')->middleware('role:admin|manager');
    Route::patch('/{additionalFee}', [AdditionalFeeController::class, 'update'])->name('update')->middleware('role:admin|manager');
    Route::delete('/{additionalFee}', [AdditionalFeeController::class, 'destroy'])->name('destroy')->middleware('role:admin');
});
