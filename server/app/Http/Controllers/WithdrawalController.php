<?php

namespace App\Http\Controllers;

use App\Models\Withdrawal;
use App\Http\Requests\WithdrawalRequest;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    public function index(Request $request)
    {
        $query = Withdrawal::with(['user', 'collector', 'balance']);

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
        $withdrawals = $query->paginate($perPage);

        return response()->json($withdrawals);
    }

    public function store(WithdrawalRequest $request)
    {
        $withdrawal = Withdrawal::create($request->validated());
        return response()->json($withdrawal, 201);
    }

    public function show($id)
    {
        $withdrawal = Withdrawal::with(['user', 'collector', 'balance'])->findOrFail($id);
        return response()->json($withdrawal);
    }

    public function update(WithdrawalRequest $request, $id)
    {
        $withdrawal = Withdrawal::findOrFail($id);
        $withdrawal->update($request->validated());
        return response()->json($withdrawal);
    }

    public function destroy($id)
    {
        $withdrawal = Withdrawal::findOrFail($id);
        $withdrawal->delete();
        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        Withdrawal::whereIn('id', $ids)->delete();
        return response()->json(null, 204);
    }
}
