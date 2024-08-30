<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InstallmentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'reference' => 'required|string|unique:installments,reference,' . $this->id,
            'debt_id' => 'required|exists:debts,id',
            'amount' => 'required|numeric',
            'due_date' => 'required|date',
            'paid_at' => 'nullable|date',
            'notes' => 'nullable|string',
            'status' => 'required|in:pending,partial,paid,overdue,cancelled',
            'collector_id' => 'nullable|exists:users,id',
        ];
    }
}
