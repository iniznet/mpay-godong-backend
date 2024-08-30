<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\WithdrawalController;
use App\Http\Controllers\InstallmentController;

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('refresh', 'refresh');
});

Route::middleware('auth:api')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::post('logout', 'logout');
        Route::get('user', 'current');
    });

    Route::apiResource('users', UserController::class);
    Route::post('users/delete-multiple', [UserController::class, 'destroyMultiple']);

    Route::apiResource('members', MemberController::class);
    Route::post('members/delete-multiple', [MemberController::class, 'destroyMultiple']);

    Route::apiResource('balances', BalanceController::class);
    Route::post('balances/delete-multiple', [BalanceController::class, 'destroyMultiple']);

    Route::apiResource('deposits', DepositController::class);
    Route::post('deposits/delete-multiple', [DepositController::class, 'destroyMultiple']);

    Route::apiResource('withdrawals', WithdrawalController::class);
    Route::post('withdrawals/delete-multiple', [WithdrawalController::class, 'destroyMultiple']);

    Route::apiResource('debts', DebtController::class);
    Route::post('debts/delete-multiple', [DebtController::class, 'destroyMultiple']);

    Route::apiResource('installments', InstallmentController::class);
    Route::post('installments/delete-multiple', [InstallmentController::class, 'destroyMultiple']);
});
