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
        Schema::create('mutasi_tabungan', function (Blueprint $table) {
            $table->id('ID');
            $table->char('CabangEntry', 3)->nullable();
            $table->string('Faktur', 20)->nullable();
            $table->date('Tgl')->default('1970-01-01');
            $table->string('Rekening', 15)->nullable();
            $table->char('KodeTransaksi', 3)->nullable();
            $table->char('DK', 1)->nullable();
            $table->string('Keterangan', 255)->nullable();
            $table->double('Jumlah', 16, 2)->default(0.00);
            $table->double('Debet', 16, 2)->default(0.00);
            $table->double('Kredit', 16, 2)->default(0.00);
            $table->string('UserName', 20)->nullable();
            $table->dateTime('DateTime')->nullable()->default('1970-01-01 00:00:00');
            $table->string('UserAcc', 20)->nullable();
            $table->double('Denda', 16, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mutasi_tabungan');
    }
};
