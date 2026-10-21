<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Subscription Plans Table
        if (!Schema::hasTable('subscription_plans')) {
            Schema::create('subscription_plans', function (Blueprint $table) {
                $table->id();
                $table->string('name'); // Starter, Growth, Enterprise
                $table->string('slug')->unique();
                $table->decimal('price', 10, 2)->default(0);
                $table->string('currency')->default('MYR');
                $table->enum('billing_cycle', ['monthly', 'yearly'])->default('monthly');
                $table->json('modules_included'); // ['packages', 'hotel', 'flight', 'car_rental', 'corporate']
                $table->integer('staff_limit')->default(3); // e.g. 3 for starter, 10 for growth, 999 for enterprise
                $table->decimal('commission_rate', 5, 2)->default(10.00); // Higher % for starter, mid for growth, negotiated for enterprise
                $table->text('description')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // 2. Enhance Agencies Table with SaaS Multi-Tenancy fields
        Schema::table('agencies', function (Blueprint $table) {
            if (!Schema::hasColumn('agencies', 'country_region')) {
                $table->string('country_region')->default('Malaysia')->after('city');
            }
            if (!Schema::hasColumn('agencies', 'currency')) {
                $table->string('currency', 10)->default('MYR')->after('country_region');
            }
            if (!Schema::hasColumn('agencies', 'subscription_plan_id')) {
                $table->foreignId('subscription_plan_id')->nullable()->after('currency')->constrained('subscription_plans')->nullOnDelete();
            }
            if (!Schema::hasColumn('agencies', 'trial_status')) {
                $table->enum('trial_status', ['trialing', 'active', 'expired', 'none'])->default('trialing')->after('subscription_tier');
            }
            if (!Schema::hasColumn('agencies', 'trial_ends_at')) {
                $table->timestamp('trial_ends_at')->nullable()->after('trial_status');
            }
            if (!Schema::hasColumn('agencies', 'is_permanently_free')) {
                $table->boolean('is_permanently_free')->default(false)->after('trial_ends_at');
            }
            if (!Schema::hasColumn('agencies', 'branding')) {
                $table->json('branding')->nullable()->after('is_permanently_free');
            }
            if (!Schema::hasColumn('agencies', 'custom_domain')) {
                $table->string('custom_domain')->nullable()->after('branding');
            }
        });

        // 3. Enhance Users Table with Profile and Roles
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'profile_completed')) {
                $table->boolean('profile_completed')->default(false)->after('is_active');
            }
            if (!Schema::hasColumn('users', 'cnic_passport')) {
                $table->string('cnic_passport')->nullable()->after('profile_completed');
            }
            if (!Schema::hasColumn('users', 'designation')) {
                $table->string('designation')->nullable()->after('cnic_passport');
            }
            if (!Schema::hasColumn('users', 'bank_details')) {
                $table->json('bank_details')->nullable()->after('designation');
            }
            if (!Schema::hasColumn('users', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('agency_id');
            }
        });

        // 4. Staff Module & Permission Access Matrix (Section 3.2 Owner-Controlled)
        if (!Schema::hasTable('staff_module_access')) {
            Schema::create('staff_module_access', function (Blueprint $table) {
                $table->id();
                $table->foreignId('staff_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
                $table->enum('module', ['packages', 'hotel', 'flight', 'car_rental', 'corporate']);
                $table->enum('permission_level', ['view_only', 'add_edit', 'book_only', 'approve_refund', 'full_access'])->default('view_only');
                $table->boolean('can_view')->default(true);
                $table->boolean('can_add_edit')->default(false);
                $table->boolean('can_book')->default(false);
                $table->boolean('can_approve_refund')->default(false);
                $table->timestamps();

                $table->unique(['staff_id', 'module'], 'staff_module_unique');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff_module_access');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['profile_completed', 'cnic_passport', 'designation', 'bank_details', 'branch_id']);
        });

        Schema::table('agencies', function (Blueprint $table) {
            $table->dropForeign(['subscription_plan_id']);
            $table->dropColumn([
                'country_region',
                'currency',
                'subscription_plan_id',
                'trial_status',
                'trial_ends_at',
                'is_permanently_free',
                'branding',
                'custom_domain',
            ]);
        });

        Schema::dropIfExists('subscription_plans');
    }
};
