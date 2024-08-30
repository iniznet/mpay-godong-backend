<?php

namespace Database\Factories;

use App\Enums\DebtStatusEnum;
use App\Enums\UserRoleEnum;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DebtFactory extends Factory
{
    public function definition(): array
    {
        return [
            'reference' => $this->faker->unique()->randomNumber(8),
            'member_id' => $this->faker->randomElement(Member::pluck('id')->toArray()),
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'interest_rate' => $this->faker->randomFloat(2, 0.1, 5),
            'months' => $this->faker->numberBetween(1, 36),
            'status' => $this->faker->randomElement(DebtStatusEnum::cases())->value,
            'notes' => $this->faker->sentence(),
        ];
    }
}
