<?php

namespace App\Enums;

enum ProjectStatusesEnum: string
{
    case ON_GOING = 'ongoing';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}
