<?php

namespace App\Http\Controllers;

use App\Models\Installment;
use App\Http\Requests\InstallmentRequest;
use Illuminate\Http\Request;

class InstallmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Installment::with(['debt', 'collector']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('reference', 'like', "%{$search}%")
                ->orWhere('amount', 'like', "%{$search}%")
                ->orWhereHas('debt', function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%");
                });
        }

        if ($request->has('sort_field') && $request->has('sort_order')) {
            $query->orderBy($request->input('sort_field'), $request->input('sort_order'));
        }

        $perPage = $request->input('per_page', 10);
        $installments = $query->paginate($perPage);

        return response()->json($installments);
    }

    public function store(InstallmentRequest $request)
    {
        $installment = Installment::create($request->validated());
        return response()->json($installment, 201);
    }

    public function show($id)
    {
        $installment = Installment::with(['debt', 'collector'])->findOrFail($id);
        return response()->json($installment);
    }

    public function update(InstallmentRequest $request, $id)
    {
        $installment = Installment::findOrFail($id);
        $installment->update($request->validated());
        return response()->json($installment);
    }

    public function destroy($id)
    {
        $installment = Installment::findOrFail($id);
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
