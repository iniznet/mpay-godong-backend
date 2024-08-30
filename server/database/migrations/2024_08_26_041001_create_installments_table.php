<?php

use App\Enums\InstallmentStatusEnum;
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
        Schema::create('installments', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->decimal('principal', 19, 2);
            $table->decimal('interest', 19, 2);
            $table->decimal('remaining', 19, 2);
            $table->integer('month');
            $table->timestamp('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default(InstallmentStatusEnum::PENDING->value);
            $table->foreignId('collector_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installments');
    }
};
