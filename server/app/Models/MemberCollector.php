<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberCollector extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_id',
        'collector_id',
    ];

    public function member_id()
    {
        return $this->belongsTo(Member::class);
    }

    public function collector()
    {
        return $this->belongsTo(User::class, 'collector_id');
    }
}
