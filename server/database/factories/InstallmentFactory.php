<?php

namespace Database\Factories;

use App\Enums\InstallmentStatusEnum;
use App\Enums\UserRoleEnum;
use App\Models\Debt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InstallmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'reference' => $this->faker->uuid(),
            'debt_id' => $this->faker->randomElement(Debt::pluck('id')->toArray()),
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'paid_at' => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'notes' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(InstallmentStatusEnum::cases())->value,
            'collector_id' => $this->faker->randomElement(User::where('role', UserRoleEnum::COLLECTOR)->pluck('id')->toArray()),
        ];
    }
}
