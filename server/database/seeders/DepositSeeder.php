<?php

namespace Database\Seeders;

use App\Models\Deposit;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DepositSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Deposit::factory(30)->create();
    }
}
