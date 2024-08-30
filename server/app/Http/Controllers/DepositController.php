<?php

namespace App\Http\Controllers;

use App\Models\Deposit;
use App\Http\Requests\DepositRequest;
use Illuminate\Http\Request;

class DepositController extends Controller
{
    public function index(Request $request)
    {
        $query = Deposit::with(['member', 'collector', 'balance']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('reference', 'like', "%{$search}%")
                ->orWhere('amount', 'like', "%{$search}%")
                ->orWhereHas('member', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
        }

        if ($request->has('sort_field') && $request->has('sort_order')) {
            $query->orderBy($request->input('sort_field'), $request->input('sort_order'));
        }

        $perPage = $request->input('per_page', 10);
        $deposits = $query->paginate($perPage);

        return response()->json($deposits);
    }

    public function store(DepositRequest $request)
    {
        $deposit = Deposit::create($request->validated());
        return response()->json($deposit, 201);
    }

    public function show($id)
    {
        $deposit = Deposit::with(['member', 'collector', 'balance'])->findOrFail($id);
        return response()->json($deposit);
    }

    public function update(DepositRequest $request, $id)
    {
        $deposit = Deposit::findOrFail($id);
        $deposit->update($request->validated());
        return response()->json($deposit);
    }

    public function destroy($id)
    {
        $deposit = Deposit::findOrFail($id);
        $deposit->delete();
        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        Deposit::whereIn('id', $ids)->delete();
        return response()->json(null, 204);
    }
}
