<?php

namespace Database\Factories;

use App\Enums\BalanceStatusEnum;
use App\Enums\UserRoleEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BalanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->randomElement(User::where('role', UserRoleEnum::CUSTOMER)->pluck('id')->toArray()),
            'amount' => $this->faker->randomFloat(2, 0, 10000),
            'status' => $this->faker->randomElement(BalanceStatusEnum::cases())->value,
        ];
    }
}
