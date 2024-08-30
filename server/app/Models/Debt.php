<?php

namespace App\Models;

use App\Enums\DebtStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'member_id',
        'amount',
        'interest_rate',
        'months',
        'status',
        'notes',
    ];

    protected $casts = [
        'status' => DebtStatusEnum::class,
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function installments()
    {
        return $this->hasMany(Installment::class);
    }
}
