<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BalanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'code' => 'required|string|unique:balances,code,' . $this->id,
            'member_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'status' => 'required|string',
        ];
    }
}
