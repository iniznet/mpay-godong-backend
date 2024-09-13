<?php

namespace App\Http\Controllers;

use App\Models\Tabungan;
use App\Models\Nasabah;
use Illuminate\Http\Request;
use App\Http\Requests\TabunganRequest;

class TabunganController extends Controller
{
    public function index()
    {
        $query = Tabungan::query();

        if (request()->has('search')) {
            $searchTerm = request()->search;
            $query->where('Kode', 'like', "%{$searchTerm}%")
                ->orWhere('Rekening', 'like', "%{$searchTerm}%")
                ->orWhere('NamaNasabah', 'like', "%{$searchTerm}%")
                ->orWhere('UserName', 'like', "%{$searchTerm}%");
        }

        if (request()->has('sort_field') && request()->has('sort_order')) {
            $query->orderBy(request()->sort_field, request()->sort_order);
        }

        $perPage = request()->input('per_page', 10);
        $tabungans = $perPage != -1 ? $query->paginate($perPage) : $query->get();

        return response()->json($tabungans);
    }

    public function store(TabunganRequest $request)
    {
        $tabungan = Tabungan::create($request->validated());
        return response()->json($tabungan, 201);
    }

    public function show(Tabungan $tabungan)
    {
        return response()->json($tabungan);
    }

    public function update(TabunganRequest $request, Tabungan $tabungan)
    {
        $tabungan->update($request->validated());
        return response()->json($tabungan);
    }

    public function destroy(Tabungan $tabungan)
    {
        $tabungan->delete();
        return response()->json(null, 204);
    }

    public function searchNasabah(Request $request)
    {
        $query = Nasabah::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('Kode', 'like', "%{$searchTerm}%")
                ->orWhere('Nama', 'like', "%{$searchTerm}%");
        }

        $nasabahs = $query->get();
        return response()->json($nasabahs);
    }
}
