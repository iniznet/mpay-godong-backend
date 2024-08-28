<?php

namespace Database\Seeders;

use App\Models\Withdrawal;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class WithdrawalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Withdrawal::factory(30)->create();
    }
}
