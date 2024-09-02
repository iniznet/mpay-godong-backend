<?php

namespace App\Models;

use App\Enums\BalanceStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'name',
        'code',
        'amount',
        'status',
    ];

    protected $casts = [
        'status' => BalanceStatusEnum::class,
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
