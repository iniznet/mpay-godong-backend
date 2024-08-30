<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use App\Http\Requests\MemberRequest;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $query = Member::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        $perPage = $request->input('per_page', 10);
        $members = $perPage != -1 ? $query->paginate($perPage) : $query->get();

        return response()->json($members);
    }

    public function store(MemberRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['password'] = Hash::make($validatedData['password']);

        $member = Member::create($validatedData);

        return response()->json($member, 201);
    }

    public function show(Member $member)
    {
        return response()->json($member);
    }

    public function update(MemberRequest $request, Member $member)
    {
        $validatedData = $request->validated();

        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        } else {
            unset($validatedData['password']);
        }

        $member->update($validatedData);

        return response()->json($member);
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return response()->json(null, 204);
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input('ids');
        Member::whereIn('id', $ids)->delete();

        return response()->json(null, 204);
    }
}
