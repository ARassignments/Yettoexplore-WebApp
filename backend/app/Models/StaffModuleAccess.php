<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffModuleAccess extends Model
{
    use HasFactory;

    protected $table = 'staff_module_access';

    protected $fillable = [
        'staff_id',
        'agency_id',
        'module',
        'permission_level',
        'can_view',
        'can_add_edit',
        'can_book',
        'can_approve_refund',
    ];

    protected function casts(): array
    {
        return [
            'can_view' => 'boolean',
            'can_add_edit' => 'boolean',
            'can_book' => 'boolean',
            'can_approve_refund' => 'boolean',
        ];
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class, 'agency_id');
    }
}
