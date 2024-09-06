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
        Schema::create('angsuran', function (Blueprint $table) {
            $table->id('ID');
            $table->char('CabangEntry', 3)->nullable();
            $table->char('Status', 1)->nullable();
            $table->string('Faktur', 20);
            $table->date('Tgl')->default('1970-01-01');
            $table->string('Rekening', 15);
            $table->string('Keterangan', 255)->nullable();
            $table->double('DPokok', 16, 2)->default(0.00);
            $table->double('KPokok', 16, 2)->default(0.00);
            $table->double('DBunga', 16, 2)->default(0.00);
            $table->double('KBunga', 16, 2)->default(0.00);
            $table->double('Denda', 16, 2)->default(0.00);
            $table->double('Administrasi', 16, 2)->default(0.00);
            $table->char('Kas', 1)->default('K');
            $table->dateTime('DateTime')->nullable()->default('1970-01-01 00:00:00');
            $table->string('UserName', 20)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('angsuran');
    }
};
