<?php

namespace App\Observers;

use App\Models\MutasiTabungan;

class MutasiTabunganObserver
{
    public function created(MutasiTabungan $mutasiTabungan)
    {
        $tipe = $mutasiTabungan->DK;
        $jumlah = $mutasiTabungan->Jumlah;
        $tabungan = $mutasiTabungan->Rekening;

        if ($tipe == 'D') {
            $mutasiTabungan->Debet = $jumlah;
            $mutasiTabungan->Kredit = 0;
            $tabungan->SaldoAkhir -= $jumlah;
        } else {
            $mutasiTabungan->Debet = 0;
            $mutasiTabungan->Kredit = $jumlah;
            $tabungan->SaldoAkhir += $jumlah;
        }

        $tabungan->save();
    }

    public function updated(MutasiTabungan $mutasiTabungan)
    {
        $tipe = $mutasiTabungan->DK;
        $jumlah = $mutasiTabungan->Jumlah;
        $tabungan = $mutasiTabungan->Rekening;

        if ($tipe == 'D') {
            $mutasiTabungan->Debet = $jumlah;
            $mutasiTabungan->Kredit = 0;
            $tabungan->SaldoAkhir -= $jumlah;
        } else {
            $mutasiTabungan->Debet = 0;
            $mutasiTabungan->Kredit = $jumlah;
            $tabungan->SaldoAkhir += $jumlah;
        }
    }
}
