<?php

namespace Database\Factories;

use App\Enums\TransactionStatusEnum;
use App\Enums\UserRoleEnum;
use App\Models\Balance;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepositFactory extends Factory
{
    public function definition(): array
    {
        $userId = $this->faker->randomElement(User::where('role', UserRoleEnum::CUSTOMER)->pluck('id')->toArray());
        $balanceId = $this->faker->randomElement(Balance::where('user_id', $userId)->pluck('id')->toArray());

        return [
            'balance_id' => $balanceId,
            'user_id' => $userId,
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'status' => $this->faker->randomElement(TransactionStatusEnum::cases())->value,
            'collector_id' => $this->faker->randomElement(User::where('role', UserRoleEnum::COLLECTOR)->pluck('id')->toArray()),
            'notes' => $this->faker->sentence(),
        ];
    }
}