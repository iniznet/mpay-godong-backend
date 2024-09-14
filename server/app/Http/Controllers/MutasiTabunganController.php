<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Tabungan;
use Illuminate\Http\Request;
use App\Models\MutasiTabungan;
use App\Http\Controllers\Controller;
use App\Http\Requests\MutasiTabunganRequest;

class MutasiTabunganController extends Controller
{
    public function index()
    {
        $query = MutasiTabungan::query();

        if (request()->has('search')) {
            $searchTerm = request()->search;
            $query->where('Rekening', 'like', "%{$searchTerm}%")
                ->orWhere('KodeTransaksi', 'like', "%{$searchTerm}%")
                ->orWhere('Keterangan', 'like', "%{$searchTerm}%")
                ->orWhere('UserName', 'like', "%{$searchTerm}%");
        }

        if (request()->has('sort_field') && request()->has('sort_order')) {
            $query->orderBy(request()->sort_field, request()->sort_order);
        }

        $perPage = request()->input('per_page', 10);
        $mutasiTabungans = $perPage != -1 ? $query->paginate($perPage) : $query->get();

        return response()->json($mutasiTabungans);
    }

    public function store(MutasiTabunganRequest $request)
    {
        $data = $request->validated();

        if (isset($data['Tgl'])) {
            $data['Tgl'] = Carbon::parse($data['Tgl'])->format('Y-m-d');
        }
        if (isset($data['DateTime'])) {
            $data['DateTime'] = Carbon::parse($data['DateTime'])->format('Y-m-d H:i:s');
        }

        $mutasiTabungan = MutasiTabungan::create($data);

        return response()->json($mutasiTabungan, 201);
    }

    public function show(MutasiTabungan $mutasiTabungan)
    {
        return response()->json($mutasiTabungan);
    }

    public function update(MutasiTabunganRequest $request, MutasiTabungan $mutasiTabungan)
    {
        $data = $request->validated();

        if (isset($data['Tgl'])) {
            $data['Tgl'] = Carbon::parse($data['Tgl'])->format('Y-m-d');
        }
        if (isset($data['DateTime'])) {
            $data['DateTime'] = Carbon::parse($data['DateTime'])->format('Y-m-d H:i:s');
        }

        $mutasiTabungan->update($data);

        return response()->json($mutasiTabungan);
    }

    public function destroy(MutasiTabungan $mutasiTabungan)
    {
        $mutasiTabungan->delete();
        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids', []);
        MutasiTabungan::whereIn('id', $ids)->delete();
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
        $lastFaktur = MutasiTabungan::where('Faktur', 'like', $date . '%')
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
