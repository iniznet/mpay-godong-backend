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
        Schema::create('nasabah', function (Blueprint $table) {
            $table->id('ID');
            $table->string('CabangEntry', 12);
            $table->string('Nama', 100)->nullable();
            $table->string('Kode', 12);
            $table->date('Tgl')->default('1970-01-01');
            $table->string('KodeLama', 50)->nullable();
            $table->date('TglLahir')->nullable();
            $table->string('TempatLahir', 255)->nullable();
            $table->char('StatusPerkawinan', 1)->nullable();
            $table->string('KTP', 30)->nullable();
            $table->string('Agama', 255)->nullable();
            $table->string('Alamat', 255)->nullable();
            $table->string('Telepon', 30)->nullable();
            $table->string('Email', 255)->nullable();
            $table->index(['CabangEntry', 'Kode']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nasabah');
    }
};
