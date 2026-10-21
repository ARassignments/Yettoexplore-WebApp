<?php

namespace App\Models\Traits;

use App\Models\Agency;
use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            if (!$model->agency_id && Auth::check() && Auth::user()->agency_id) {
                $model->agency_id = Auth::user()->agency_id;
            }
        });
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class, 'agency_id');
    }
}
