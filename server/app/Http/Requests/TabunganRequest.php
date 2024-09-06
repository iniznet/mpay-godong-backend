<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TabunganRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'Rekening' => 'required|string|max:11',
            'RekeningLama' => 'nullable|string|max:50',
            'Tgl' => 'required|date',
            'Kode' => 'nullable|string|max:12',
            'NamaNasabah' => 'required|string|max:100',
            'GolonganTabungan' => 'nullable|string|max:6',
            'StatusBlokir' => 'required|string|max:1',
            'JumlahBlokir' => 'required|numeric',
            'TglPenutupan' => 'nullable|date',
            'KeteranganBlokir' => 'nullable|string|max:255',
            'SaldoAkhir' => 'required|numeric',
            'Pekerjaan' => 'nullable|string|max:4',
            'UserName' => 'nullable|string|max:20',
        ];
    }
}
