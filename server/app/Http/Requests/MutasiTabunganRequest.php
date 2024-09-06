<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MutasiTabunganRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'CabangEntry' => 'nullable|string|max:255',
            'Faktur' => 'required|string|max:255',
            'Tgl' => 'required|date',
            'Rekening' => 'required|string|max:255',
            'KodeTransaksi' => 'nullable|string|max:255',
            'DK' => 'required|in:D,K',
            'Keterangan' => 'nullable|string|max:255',
            'Jumlah' => 'required|numeric|min:0',
            'Debet' => 'required|numeric|min:0',
            'Kredit' => 'required|numeric|min:0',
            'UserName' => 'nullable|string|max:255',
            'DateTime' => 'nullable|date',
            'UserAcc' => 'nullable|string|max:255',
            'Denda' => 'nullable|numeric|min:0',
        ];
    }
}
