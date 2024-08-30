<?php

namespace Database\Factories;

use App\Enums\BalanceStatusEnum;
use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

class BalanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'code' => $this->faker->unique()->randomNumber(8),
            'member_id' => $this->faker->randomElement(Member::pluck('id')->toArray()),
            'amount' => $this->faker->randomFloat(2, 0, 10000),
            'status' => $this->faker->randomElement(BalanceStatusEnum::cases())->value,
        ];
    }
}
