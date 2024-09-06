<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nasabah;
use App\Http\Requests\NasabahRequest;

class NasabahController extends Controller
{
    public function index(Request $request)
    {
        $query = Nasabah::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('Nama', 'like', "%{$searchTerm}%")
                    ->orWhere('Kode', 'like', "%{$searchTerm}%")
                    ->orWhere('Email', 'like', "%{$searchTerm}%")
                    ->orWhere('Telepon', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->has('sort_field') && $request->has('sort_order')) {
            $query->orderBy($request->sort_field, $request->sort_order);
        }

        $perPage = $request->input('per_page', 10);
        $nasabahs = $perPage != -1 ? $query->paginate($perPage) : $query->get();

        return response()->json($nasabahs);
    }

    public function store(NasabahRequest $request)
    {
        $validatedData = $request->validated();
        $nasabah = Nasabah::create($validatedData);

        return response()->json($nasabah, 201);
    }

    public function show(Nasabah $nasabah)
    {
        return response()->json($nasabah);
    }

    public function update(NasabahRequest $request, Nasabah $nasabah)
    {
        $validatedData = $request->validated();
        $nasabah->update($validatedData);

        return response()->json($nasabah);
    }

    public function destroy(Nasabah $nasabah)
    {
        $nasabah->delete();

        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        Nasabah::whereIn('ID', $ids)->delete();

        return response()->json(null, 204);
    }
}
