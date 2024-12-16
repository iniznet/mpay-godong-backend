<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\DebiturController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\NasabahController;
use App\Http\Controllers\AngsuranController;
use App\Http\Controllers\TabunganController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WithdrawalController;
use App\Http\Controllers\InstallmentController;
use App\Http\Controllers\MutasiTabunganController;

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

    Route::apiResource('nasabah', NasabahController::class);
    Route::post('nasabah/delete-multiple', [NasabahController::class, 'destroyMultiple']);

    Route::apiResource('tabungan', TabunganController::class);
    Route::post('tabungan/delete-multiple', [TabunganController::class, 'destroyMultiple']);

    Route::get('debitur/next-faktur', [DebiturController::class, 'getNextFaktur']);
    Route::apiResource('debitur', DebiturController::class);
    Route::post('debitur/delete-multiple', [DebiturController::class, 'destroyMultiple']);

    Route::get('mutasi-tabungan/next-faktur', [MutasiTabunganController::class, 'getNextFaktur']);
    Route::get('mutasi-tabungan/kode-transaksi', [MutasiTabunganController::class, 'getKodeTransaksi']);
    Route::apiResource('mutasi-tabungan', MutasiTabunganController::class);
    Route::post('mutasi-tabungan/delete-multiple', [MutasiTabunganController::class, 'destroyMultiple']);

    Route::get('angsuran/next-faktur', [AngsuranController::class, 'getNextFaktur']);
    Route::apiResource('angsuran', AngsuranController::class);
    Route::post('angsuran/delete-multiple', [AngsuranController::class, 'destroyMultiple']);

    Route::prefix('dashboard')->group(function () {
        Route::get('/summary', [DashboardController::class, 'getSummary']);
        Route::get('/recent-transactions', [DashboardController::class, 'getRecentTransactions']);
        Route::get('/top-products', [DashboardController::class, 'getTopProducts']);
        Route::get('/sales-overview', [DashboardController::class, 'getSalesOverview']);
        Route::get('/notifications', [DashboardController::class, 'getNotifications']);
    });
});
