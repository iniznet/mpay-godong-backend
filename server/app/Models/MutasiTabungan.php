<?php

namespace App\Models;

use App\Observers\MutasiTabunganObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(MutasiTabunganObserver::class)]
class MutasiTabungan extends Model
{
    use HasFactory;

    protected $table = 'mutasi_tabungan';
    protected $primaryKey = 'ID';
    protected $fillable = ['CabangEntry', 'Faktur', 'Tgl', 'Rekening', 'KodeTransaksi', 'DK', 'Keterangan', 'Jumlah', 'Debet', 'Kredit', 'UserName', 'DateTime', 'UserAcc', 'Denda'];

    public function tabungan()
    {
        return $this->belongsTo(Tabungan::class, 'Rekening', 'Rekening');
    }
}
