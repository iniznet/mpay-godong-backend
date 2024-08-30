<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use App\Http\Requests\DebtRequest;
use Illuminate\Http\Request;

class DebtController extends Controller
{
    public function index(Request $request)
    {
        $query = Debt::with(['user']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('reference', 'like', "%{$search}%")
                ->orWhere('amount', 'like', "%{$search}%")
                ->orWhereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        if ($request->has('sort_field') && $request->has('sort_order')) {
            $query->orderBy($request->input('sort_field'), $request->input('sort_order'));
        }

        $perPage = $request->input('per_page', 10);
        $debts = $query->paginate($perPage);

        return response()->json($debts);
    }

    public function store(DebtRequest $request)
    {
        $debt = Debt::create($request->validated());
        return response()->json($debt, 201);
    }

    public function show($id)
    {
        $debt = Debt::with(['user'])->findOrFail($id);
        return response()->json($debt);
    }

    public function update(DebtRequest $request, $id)
    {
        $debt = Debt::findOrFail($id);
        $debt->update($request->validated());
        return response()->json($debt);
    }

    public function destroy($id)
    {
        $debt = Debt::findOrFail($id);
        $debt->delete();
        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        Debt::whereIn('id', $ids)->delete();
        return response()->json(null, 204);
    }
}
