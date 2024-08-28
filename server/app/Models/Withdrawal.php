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
        'user_id',
        'amount',
        'status',
        'collector_id',
        'notes',
    ];

    public function balance()
    {
        return $this->belongsTo(Balance::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function collector()
    {
        return $this->belongsTo(User::class, 'collector_id');
    }
}
