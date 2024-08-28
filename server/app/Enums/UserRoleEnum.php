<?php

namespace App\Enums;

enum UserRoleEnum: string
{
    case ADMIN = 'admin';
    case CUSTOMER = 'customer';
    case COLLECTOR = 'collector';

    public static function toArray(): array
    {
        return [
            self::ADMIN,
            self::CUSTOMER,
            self::COLLECTOR,
        ];
    }
}
