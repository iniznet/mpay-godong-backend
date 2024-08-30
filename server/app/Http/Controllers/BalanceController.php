<?php

namespace App\Http\Controllers;

use App\Models\Balance;
use App\Http\Requests\BalanceRequest;
use Illuminate\Http\Request;

class BalanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Balance::with('user');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhere('amount', 'like', "%{$search}%");
        }

        if ($request->has('sort_field') && $request->has('sort_order')) {
            $query->orderBy($request->input('sort_field'), $request->input('sort_order'));
        }

        $perPage = $request->input('per_page', 10);
        $balances = $perPage != -1 ? $query->paginate($perPage) : $query->get();

        return response()->json($balances);
    }

    public function store(BalanceRequest $request)
    {
        $balance = Balance::create($request->validated());
        return response()->json($balance, 201);
    }

    public function show($id)
    {
        $balance = Balance::with('user')->findOrFail($id);
        return response()->json($balance);
    }

    public function update(BalanceRequest $request, $id)
    {
        $balance = Balance::findOrFail($id);
        $balance->update($request->validated());
        return response()->json($balance);
    }

    public function destroy($id)
    {
        $balance = Balance::findOrFail($id);
        $balance->delete();
        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        Balance::whereIn('id', $ids)->delete();
        return response()->json(null, 204);
    }
}
