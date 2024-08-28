<?php

namespace App\Models;

use App\Enums\InstallmentStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'debt_id',
        'amount',
        'due_date',
        'paid_at',
        'notes',
        'status',
        'collector_id',
    ];

    protected $casts = [
        'status' => InstallmentStatusEnum::class,
        'due_date' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function debt()
    {
        return $this->belongsTo(Debt::class);
    }

    public function collector()
    {
        return $this->belongsTo(User::class, 'collector_id');
    }
}
