<?php

namespace App\Enums;

enum DebtStatusEnum: string
{
    case PENDING = 'pending';
    case CANCELLED = 'cancelled';
    case REJECTED = 'rejected';
    case ACTIVE = 'active';
    case ON_HOLD = 'on_hold';
    case PAID = 'paid';
}
