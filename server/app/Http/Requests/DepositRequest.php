<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DepositRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'reference' => 'required|string|unique:deposits,reference,' . $this->id,
            'balance_id' => 'required|exists:balances,id',
            'member_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string',
            'collector_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ];
    }
}
