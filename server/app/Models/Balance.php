<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'amount',
        'status',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
