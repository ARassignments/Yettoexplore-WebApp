<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (Auth::check()) {
            $user = Auth::user();

            // If user belongs to an agency and is not super_admin or platform_support
            if ($user->agency_id && !in_array($user->role, ['super_admin', 'platform_support', 'customer'])) {
                $builder->where($model->getTable() . '.agency_id', $user->agency_id);
            }
        }
    }
}
