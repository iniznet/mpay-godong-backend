<?php

namespace App\Models;

use App\Enums\MemberStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'avatar',
        'status',
    ];

    protected $casts = [
        'status' => MemberStatusEnum::class,
    ];

    public function deposits()
    {
        return $this->hasMany(Deposit::class);
    }

    public function debts()
    {
        return $this->hasMany(Debt::class);
    }

    public function balance()
    {
        return $this->hasMany(Balance::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function installments()
    {
        return $this->hasManyThrough(Installment::class, Debt::class);
    }
}
