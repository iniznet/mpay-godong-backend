<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tabungan extends Model
{
    use HasFactory;

    protected $table = 'tabungan';
    protected $primaryKey = 'ID';
    protected $fillable = ['Rekening', 'RekeningLama', 'Tgl', 'Kode', 'NamaNasabah', 'GolonganTabungan', 'StatusBlokir', 'JumlahBlokir', 'TglPenutupan', 'KeteranganBlokir', 'SaldoAkhir', 'Pekerjaan', 'UserName'];

    protected $with = ['nasabah', 'mutasiTabungan'];

    protected $casts = [
        'Tgl' => 'date',
        'TglPenutupan' => 'date',
        'SaldoAkhir' => 'decimal:2',
    ];

    public function nasabah()
    {
        return $this->belongsTo(Nasabah::class, 'Kode', 'Kode');
    }

    public function debitur()
    {
        return $this->hasOne(Debitur::class, 'RekeningTabungan', 'Rekening');
    }

    public function mutasiTabungan()
    {
        return $this->hasMany(MutasiTabungan::class, 'Rekening', 'Rekening');
    }
}
