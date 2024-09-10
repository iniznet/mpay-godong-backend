<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Debitur extends Model
{
    use HasFactory;

    protected $table = 'debitur';
    protected $primaryKey = 'ID';
    protected $fillable = ['Kode', 'Faktur', 'Rekening', 'RekeningLama', 'Tgl', 'StatusPencairan', 'NoPengajuan', 'RekeningJaminan', 'Jaminan', 'KeteranganJaminan', 'Wilayah', 'SukuBunga', 'Plafond', 'PencairanPokok', 'TotalBunga', 'SaldoPokok', 'SaldoBunga', 'SaldoTitipan', 'RekeningTabungan', 'DateTime', 'UserName'];

    protected $with = ['nasabah'];

    public function nasabah()
    {
        return $this->belongsTo(Nasabah::class, 'Kode', 'Kode');
    }

    public function angsuran()
    {
        return $this->hasMany(Angsuran::class, 'Rekening', 'Rekening');
    }

    public function tabungan()
    {
        return $this->belongsTo(Tabungan::class, 'RekeningTabungan', 'Rekening');
    }
}
