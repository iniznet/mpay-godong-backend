<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AngsuranRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust this based on your authorization logic
    }

    public function rules()
    {
        return [
            'CabangEntry' => 'nullable|string|max:3',
            'Status' => 'nullable|string|max:1',
            'Faktur' => 'required|string|max:20',
            'Tgl' => 'required|date',
            'Rekening' => 'required|string|max:15',
            'Keterangan' => 'nullable|string|max:255',
            'DPokok' => 'required|numeric',
            'KPokok' => 'required|numeric',
            'DBunga' => 'required|numeric',
            'KBunga' => 'required|numeric',
            'Denda' => 'required|numeric',
            'Administrasi' => 'required|numeric',
            'Kas' => 'required|string|max:1',
            'DateTime' => 'nullable|date',
            'UserName' => 'nullable|string|max:20',
        ];
    }

    public function messages()
    {
        return [
            'Faktur.required' => 'Faktur harus diisi.',
            'Tgl.required' => 'Tanggal harus diisi.',
            'Rekening.required' => 'Rekening harus diisi.',
            'DPokok.required' => 'Debet Pokok harus diisi.',
            'KPokok.required' => 'Kredit Pokok harus diisi.',
            'DBunga.required' => 'Debet Bunga harus diisi.',
            'KBunga.required' => 'Kredit Bunga harus diisi.',
            'Denda.required' => 'Denda harus diisi.',
            'Administrasi.required' => 'Administrasi harus diisi.',
            'Kas.required' => 'Kas harus diisi.',
        ];
    }
}
