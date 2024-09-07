<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nasabah extends Model
{
    use HasFactory;

    protected $table = 'nasabah';
    protected $primaryKey = 'ID';
    protected $fillable = ['CabangEntry', 'Nama', 'Kode', 'Tgl', 'KodeLama', 'TglLahir', 'TempatLahir', 'StatusPerkawinan', 'KTP', 'Agama', 'Alamat', 'Telepon', 'Email'];

    public function tabungan()
    {
        return $this->hasMany(Tabungan::class, 'Kode', 'Kode');
    }
}
