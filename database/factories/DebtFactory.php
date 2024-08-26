<?php

namespace Database\Factories;

use App\Enums\DebtStatusEnum;
use App\Enums\UserRoleEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DebtFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->randomElement(User::where('role', UserRoleEnum::CUSTOMER)->pluck('id')->toArray()),
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'interest_rate' => $this->faker->randomFloat(2, 0.01, 0.1),
            'status' => $this->faker->randomElement(DebtStatusEnum::cases())->value,
            'notes' => $this->faker->sentence(),
        ];
    }
}
