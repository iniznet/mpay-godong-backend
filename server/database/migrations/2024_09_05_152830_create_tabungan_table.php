<?php

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
        Schema::create('tabungan', function (Blueprint $table) {
            $table->id('ID');
            $table->string('Rekening', 11);
            $table->string('RekeningLama', 50)->nullable();
            $table->date('Tgl')->nullable();
            $table->string('Kode', 12)->nullable();
            $table->string('NamaNasabah', 100);
            $table->string('GolonganTabungan', 6)->nullable();
            $table->char('StatusBlokir', 1)->default('0');
            $table->double('JumlahBlokir', 16, 2)->default(0.00);
            $table->date('TglPenutupan')->nullable();
            $table->string('KeteranganBlokir', 255)->nullable();
            $table->double('SaldoAkhir', 16, 2)->default(0.00);
            $table->string('Pekerjaan', 4)->nullable();
            $table->string('UserName', 20)->nullable();
            $table->index(['Rekening', 'RekeningLama']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tabungan');
    }
};
