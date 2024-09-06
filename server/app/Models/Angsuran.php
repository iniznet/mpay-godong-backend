<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Angsuran extends Model
{
    use HasFactory;

    protected $table = 'angsuran';
    protected $primaryKey = 'ID';
    protected $fillable = ['CabangEntry', 'Status', 'Faktur', 'Tgl', 'Rekening', 'Keterangan', 'DPokok', 'KPokok', 'DBunga', 'KBunga', 'Denda', 'Administrasi', 'Kas', 'DateTime', 'UserName'];

    public function debitur()
    {
        return $this->belongsTo(Debitur::class, 'Rekening', 'Rekening');
    }
}
