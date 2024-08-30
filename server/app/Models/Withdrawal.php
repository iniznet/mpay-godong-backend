<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'balance_id',
        'member_id',
        'amount',
        'status',
        'collector_id',
        'notes',
    ];

    public function balance()
    {
        return $this->belongsTo(Balance::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function collector()
    {
        return $this->belongsTo(User::class, 'collector_id');
    }
}
