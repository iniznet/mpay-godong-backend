<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(15)->create();

        \App\Models\User::factory()->create([
            'username' => 'admin',
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        \App\Models\User::factory()->create([
            'username' => 'kolektor',
            'name' => 'Kolektor User',
            'email' => 'kolektor@example.com',
            'role' => 'collector',
        ]);

        // $this->call([
        //     MemberSeeder::class,
        //     BalanceSeeder::class,
        //     DepositSeeder::class,
        //     WithdrawalSeeder::class,
        //     DebtSeeder::class,
        // ]);
    }
}
