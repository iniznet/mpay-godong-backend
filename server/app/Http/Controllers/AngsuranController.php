<?php

namespace App\Http\Controllers;

use App\Models\Angsuran;
use App\Http\Requests\AngsuranRequest;
use Illuminate\Http\Request;

class AngsuranController extends Controller
{
    public function index(Request $request)
    {
        $query = Angsuran::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('Faktur', 'like', "%{$searchTerm}%")
                  ->orWhere('Rekening', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('sort_field') && $request->has('sort_order')) {
            $query->orderBy($request->sort_field, $request->sort_order);
        }

        $perPage = $request->input('per_page', 10);
        $angsurans = $query->paginate($perPage);

        return response()->json($angsurans);
    }

    public function store(AngsuranRequest $request)
    {
        $angsuran = Angsuran::create($request->validated());
        return response()->json($angsuran, 201);
    }

    public function show($id)
    {
        $angsuran = Angsuran::findOrFail($id);
        return response()->json($angsuran);
    }

    public function update(AngsuranRequest $request, $id)
    {
        $angsuran = Angsuran::findOrFail($id);
        $angsuran->update($request->validated());
        return response()->json($angsuran);
    }

    public function destroy($id)
    {
        $angsuran = Angsuran::findOrFail($id);
        $angsuran->delete();
        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids', []);
        Angsuran::whereIn('ID', $ids)->delete();
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
        $lastFaktur = Angsuran::where('Faktur', 'like', $date . '%')
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
