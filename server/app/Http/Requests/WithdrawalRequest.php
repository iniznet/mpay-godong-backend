<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WithdrawalRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'reference' => 'required|string|unique:withdrawals,reference,' . $this->id,
            'balance_id' => 'required|exists:balances,id',
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string',
            'collector_id' => 'required|exists:users,id',
            'notes' => 'nullable|string',
        ];
    }
}
