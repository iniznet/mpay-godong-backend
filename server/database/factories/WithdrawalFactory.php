<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Balance;
use App\Enums\UserRoleEnum;
use App\Enums\TransactionStatusEnum;
use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

class WithdrawalFactory extends Factory
{
    public function definition(): array
    {
        $memberId = $this->faker->randomElement(Member::pluck('id')->toArray());
        $balanceId = $this->faker->randomElement(Balance::where('member_id', $memberId)->pluck('id')->toArray());

        return [
            'reference' => $this->faker->unique()->randomNumber(8),
            'balance_id' => $balanceId,
            'member_id' => $memberId,
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'status' => $this->faker->randomElement(TransactionStatusEnum::cases())->value,
            'collector_id' => $this->faker->randomElement(User::where('role', UserRoleEnum::COLLECTOR)->pluck('id')->toArray()),
            'notes' => $this->faker->sentence(),
        ];
    }
}