<?php

namespace App\Http\Controllers;

use App\Models\Nasabah;
use App\Models\Tabungan;
use App\Models\MutasiTabungan;
use App\Models\Debitur;
use App\Models\Angsuran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getSummary()
    {
        $currentDate = Carbon::now();
        $lastMonthDate = $currentDate->copy()->subMonth();

        $totalNasabah = Nasabah::count();
        $newNasabah = Nasabah::where('created_at', '>=', $lastMonthDate)->count();

        $totalTabungan = Tabungan::sum('SaldoAkhir');
        $newTabungan = Tabungan::where('created_at', '>=', $lastMonthDate)->sum('SaldoAkhir');

        $totalDebitur = Debitur::count();
        $newDebitur = Debitur::where('created_at', '>=', $lastMonthDate)->count();

        $totalAngsuran = Angsuran::sum('KPokok') + Angsuran::sum('KBunga');
        $newAngsuran = Angsuran::where('created_at', '>=', $lastMonthDate)
            ->sum(DB::raw('KPokok + KBunga'));

        return response()->json([
            'totalNasabah' => $totalNasabah,
            'newNasabah' => $newNasabah,
            'totalTabungan' => $totalTabungan,
            'newTabungan' => $newTabungan,
            'totalDebitur' => $totalDebitur,
            'newDebitur' => $newDebitur,
            'totalAngsuran' => $totalAngsuran,
            'newAngsuran' => $newAngsuran,
        ]);
    }

    public function getRecentTransactions()
    {
        $recentTransactions = MutasiTabungan::orderBy('Tgl', 'desc')
            ->take(5)
            ->get(['ID', 'Tgl', 'Rekening', 'Keterangan', 'Jumlah']);

        return response()->json($recentTransactions);
    }

    public function getTopProducts()
    {
        $topDebtors = Debitur::orderBy('SaldoPokok', 'desc')
            ->take(5)
            ->get(['ID', 'Rekening', 'NoPengajuan', 'SaldoPokok']);

        return response()->json($topDebtors);
    }

    public function getSalesOverview()
    {
        $loansByWilayah = Debitur::select('Wilayah', DB::raw('SUM(Plafond) as TotalPinjaman'))
            ->groupBy('Wilayah')
            ->orderBy('TotalPinjaman', 'desc')
            ->get();

        return response()->json($loansByWilayah);
    }

    public function getNotifications()
    {
        // For this example, we'll use recent transactions as notifications
        // In a real-world scenario, you might have a separate notifications table
        $recentTransactions = MutasiTabungan::orderBy('Tgl', 'desc')
            ->take(5)
            ->get(['Tgl', 'Rekening', 'Keterangan', 'Jumlah']);

        $notifications = $recentTransactions->map(function ($transaction) {
            return [
                'title' => "Transaksi pada rekening " . $transaction->Rekening,
                'description' => $transaction->Keterangan . " - Rp " . number_format($transaction->Jumlah, 2),
            ];
        });

        return response()->json($notifications);
    }
}
