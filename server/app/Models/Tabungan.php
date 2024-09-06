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

    public function mutasiTabungan()
    {
        return $this->hasMany(MutasiTabungan::class, 'Rekening', 'Rekening');
    }
}
