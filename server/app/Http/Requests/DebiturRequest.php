<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DebiturRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'Faktur' => 'nullable|string|max:20',
            'Rekening' => 'required|string|max:15',
            'RekeningLama' => 'nullable|string|max:30',
            'Tgl' => 'required|date',
            'StatusPencairan' => 'required|string|max:1',
            'NoPengajuan' => 'nullable|string|max:15',
            'RekeningJaminan' => 'required|string|max:15',
            'Jaminan' => 'required|string|max:20',
            'KeteranganJaminan' => 'nullable|string|max:255',
            'Wilayah' => 'nullable|string|max:4',
            'SukuBunga' => 'required|numeric|between:0,99999.99999',
            'Plafond' => 'required|numeric',
            'PencairanPokok' => 'required|numeric',
            'TotalBunga' => 'required|numeric',
            'SaldoPokok' => 'required|numeric',
            'SaldoBunga' => 'required|numeric',
            'SaldoTitipan' => 'required|numeric',
            'RekeningTabungan' => 'nullable|string|max:15',
            'DateTime' => 'nullable|date',
            'UserName' => 'nullable|string|max:20',
        ];
    }

    public function messages()
    {
        return [
            'Rekening.required' => 'Rekening harus diisi.',
            'Rekening.max' => 'Rekening tidak boleh lebih dari 15 karakter.',
            'RekeningJaminan.required' => 'Rekening Jaminan harus diisi.',
            'Jaminan.required' => 'Jaminan harus diisi.',
            'SukuBunga.required' => 'Suku Bunga harus diisi.',
            'SukuBunga.between' => 'Suku Bunga harus antara 0 dan 99999,99999.',
            'Plafond.required' => 'Plafond harus diisi.',
            'PencairanPokok.required' => 'Pencairan Pokok harus diisi.',
            'TotalBunga.required' => 'Total Bunga harus diisi.',
            'SaldoPokok.required' => 'Saldo Pokok harus diisi.',
            'SaldoBunga.required' => 'Saldo Bunga harus diisi.',
            'SaldoTitipan.required' => 'Saldo Titipan harus diisi.',
        ];
    }
}
