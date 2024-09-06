<?php

namespace App\Http\Controllers;

use App\Models\Nasabah;
use App\Models\Tabungan;
use App\Models\MutasiTabungan;
use App\Models\Debitur;
use App\Models\Angsuran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getNasabahCount()
    {
        return response()->json(Nasabah::count());
    }

    public function getTabunganTotal()
    {
        return response()->json(Tabungan::sum('SaldoAkhir'));
    }

    public function getRecentMutasi()
    {
        $recentMutasi = MutasiTabungan::with('tabungan:Rekening,NamaNasabah')
            ->orderBy('Tgl', 'desc')
            ->take(10)
            ->get(['Tgl', 'Rekening', 'KodeTransaksi', 'DK', 'Keterangan', 'Jumlah']);

        return response()->json($recentMutasi);
    }

    public function getDebiturTotal()
    {
        return response()->json(Debitur::sum('SaldoPokok'));
    }

    public function getAngsuranTotal()
    {
        $total = Angsuran::where('Tgl', '>=', Carbon::now()->startOfMonth())
            ->where('Tgl', '<=', Carbon::now()->endOfMonth())
            ->sum(DB::raw('KPokok + KBunga'));

        return response()->json($total);
    }

    public function getTabunganTrend()
    {
        $trend = Tabungan::select(
            DB::raw('DATE_FORMAT(Tgl, "%Y-%m") as month'),
            DB::raw('SUM(SaldoAkhir) as total')
        )
        ->where('Tgl', '>=', Carbon::now()->subMonths(12))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

        $labels = $trend->pluck('month')->map(function ($month) {
            return Carbon::createFromFormat('Y-m', $month)->format('M Y');
        });

        $data = [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Total Tabungan',
                    'data' => $trend->pluck('total'),
                    'fill' => false,
                    'borderColor' => '#4bc0c0'
                ]
            ]
        ];

        return response()->json($data);
    }

    public function getDebiturDistribution()
    {
        $distribution = Debitur::select('Jaminan', DB::raw('COUNT(*) as count'))
            ->groupBy('Jaminan')
            ->orderByDesc('count')
            ->get();

        $data = $distribution->map(function ($item) {
            return [
                'name' => $item->Jaminan,
                'value' => $item->count
            ];
        });

        return response()->json($data);
    }

    public function getTopNasabah()
    {
        $topNasabah = Tabungan::with('nasabah:Kode,Nama')
            ->orderByDesc('SaldoAkhir')
            ->take(5)
            ->get(['Kode', 'NamaNasabah', 'SaldoAkhir']);

        return response()->json($topNasabah);
    }

    public function getTransactionSummary()
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();

        $summary = [
            'today' => MutasiTabungan::whereDate('Tgl', $today)->count(),
            'thisWeek' => MutasiTabungan::where('Tgl', '>=', $startOfWeek)->count(),
            'thisMonth' => MutasiTabungan::where('Tgl', '>=', $startOfMonth)->count(),
        ];

        return response()->json($summary);
    }

    public function getDashboardData()
    {
        $nasabahCount = $this->getNasabahCount()->original;
        $tabunganTotal = $this->getTabunganTotal()->original;
        $recentMutasi = $this->getRecentMutasi()->original;
        $debiturTotal = $this->getDebiturTotal()->original;
        $angsuranTotal = $this->getAngsuranTotal()->original;
        $tabunganTrend = $this->getTabunganTrend()->original;
        $debiturDistribution = $this->getDebiturDistribution()->original;
        $topNasabah = $this->getTopNasabah()->original;
        $transactionSummary = $this->getTransactionSummary()->original;

        return response()->json([
            'nasabahCount' => $nasabahCount,
            'tabunganTotal' => $tabunganTotal,
            'recentMutasi' => $recentMutasi,
            'debiturTotal' => $debiturTotal,
            'angsuranTotal' => $angsuranTotal,
            'tabunganTrend' => $tabunganTrend,
            'debiturDistribution' => $debiturDistribution,
            'topNasabah' => $topNasabah,
            'transactionSummary' => $transactionSummary,
        ]);
    }
}
