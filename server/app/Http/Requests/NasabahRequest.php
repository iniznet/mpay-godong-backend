<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NasabahRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'CabangEntry' => 'required|string|max:12',
            'Nama' => 'nullable|string|max:100',
            'Kode' => 'required|string|max:12',
            'Tgl' => 'required|date',
            'KodeLama' => 'nullable|string|max:50',
            'TglLahir' => 'nullable|date',
            'TempatLahir' => 'nullable|string|max:255',
            'StatusPerkawinan' => 'nullable|string|max:1',
            'KTP' => 'nullable|string|max:30',
            'Agama' => 'nullable|string|max:255',
            'Alamat' => 'nullable|string|max:255',
            'Telepon' => 'nullable|string|max:30',
            'Email' => 'nullable|email|max:255',
        ];
    }
}
