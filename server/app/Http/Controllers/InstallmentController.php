<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Installment;
use App\Http\Requests\InstallmentRequest;
use App\Enums\InstallmentStatusEnum;

class InstallmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Installment::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('reference', 'like', "%{$searchTerm}%")
                    ->orWhere('status', 'like', "%{$searchTerm}%")
                    ->orWhere('principal', 'like', "%{$searchTerm}%")
                    ->orWhere('interest', 'like', "%{$searchTerm}%")
                    ->orWhere('month', 'like', "%{$searchTerm}%")
                    ->orWhere('due_date', 'like', "%{$searchTerm}%");
            });
        }

        $perPage = $request->input('per_page', 10);
        $installments = $perPage != -1 ? $query->paginate($perPage) : $query->get();

        return response()->json($installments);
    }

    public function store(InstallmentRequest $request)
    {
        $validatedData = $request->validated();
        $installment = Installment::create($validatedData);

        return response()->json($installment, 201);
    }

    public function show(Installment $installment)
    {
        return response()->json($installment);
    }

    public function update(InstallmentRequest $request, Installment $installment)
    {
        $validatedData = $request->validated();
        $installment->update($validatedData);

        return response()->json($installment);
    }

    public function destroy(Installment $installment)
    {
        $installment->delete();

        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        Installment::whereIn('id', $ids)->delete();

        return response()->json(null, 204);
    }
}
