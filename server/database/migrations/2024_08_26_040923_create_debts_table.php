<?php

use App\Enums\DebtStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('debts', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 19, 2);
            $table->decimal('interest_rate', 5, 2);
            $table->integer('months');
            $table->string('status')->default(DebtStatusEnum::PENDING->value);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('debts');
    }
};
