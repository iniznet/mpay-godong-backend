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
        Schema::create('debitur', function (Blueprint $table) {
            $table->id('ID');
            $table->string('Faktur', 20)->nullable();
            $table->string('Rekening', 15);
            $table->string('RekeningLama', 30)->nullable();
            $table->date('Tgl')->default('1970-01-01');
            $table->char('StatusPencairan', 1)->default('0');
            $table->string('NoPengajuan', 15)->nullable();
            $table->string('RekeningJaminan', 15);
            $table->string('Jaminan', 20);
            $table->string('KeteranganJaminan', 255)->nullable();
            $table->string('Wilayah', 4)->nullable();
            $table->double('SukuBunga', 10, 5)->default(0.00000);
            $table->double('Plafond', 16, 0)->default(0);
            $table->double('PencairanPokok', 16, 0)->default(0);
            $table->double('TotalBunga', 16, 0)->default(0);
            $table->double('SaldoPokok', 16, 2)->default(0.00);
            $table->double('SaldoBunga', 16, 2)->default(0.00);
            $table->double('SaldoTitipan', 16, 2)->default(0.00);
            $table->string('RekeningTabungan', 15)->nullable();
            $table->dateTime('DateTime')->nullable()->default('1970-01-01 00:00:00');
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
        Schema::dropIfExists('debitur');
    }
};
