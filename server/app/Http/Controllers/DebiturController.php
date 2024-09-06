<?php

namespace App\Http\Controllers;

use App\Models\Debitur;
use App\Http\Requests\DebiturRequest;
use Illuminate\Http\Request;

class DebiturController extends Controller
{
    public function index(Request $request)
    {
        $query = Debitur::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('Rekening', 'like', "%{$searchTerm}%")
                  ->orWhere('Faktur', 'like', "%{$searchTerm}%")
                  ->orWhere('NoPengajuan', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('sort_field') && $request->has('sort_order')) {
            $query->orderBy($request->sort_field, $request->sort_order);
        }

        $perPage = $request->input('per_page', 10);
        $debiturs = $perPage != -1 ? $query->paginate($perPage) : $query->get();

        return response()->json($debiturs);
    }

    public function store(DebiturRequest $request)
    {
        $debitur = Debitur::create($request->validated());
        return response()->json($debitur, 201);
    }

    public function show($id)
    {
        $debitur = Debitur::findOrFail($id);
        return response()->json($debitur);
    }

    public function update(DebiturRequest $request, $id)
    {
        $debitur = Debitur::findOrFail($id);
        $debitur->update($request->validated());
        return response()->json($debitur);
    }

    public function destroy($id)
    {
        $debitur = Debitur::findOrFail($id);
        $debitur->delete();
        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids', []);
        Debitur::whereIn('ID', $ids)->delete();
        return response()->json(null, 204);
    }

    public function getNextFaktur()
    {
        $nextFaktur = $this->generateNextFaktur();
        return response()->json(['faktur' => $nextFaktur]);
    }

    private function generateNextFaktur()
    {
        $date = now()->format('Ymd');
        $lastFaktur = Debitur::where('Faktur', 'like', $date . '%')
            ->orderBy('Faktur', 'desc')
            ->value('Faktur');

        if ($lastFaktur) {
            $lastNumber = intval(substr($lastFaktur, -6));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $date . str_pad($newNumber, 12, '0', STR_PAD_LEFT);
    }
}
