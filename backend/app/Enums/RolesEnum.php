<?php

namespace App\Enums;

enum RolesEnum: string
{
    case ADMIN = 'admin';
    case MANAGER = 'manager';
    case EMPLOYEE = 'employee';
}
