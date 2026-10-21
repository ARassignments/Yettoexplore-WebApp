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
        // 1. Destinations
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('country')->default('Pakistan');
            $table->string('city')->nullable();
            $table->string('image')->nullable();
            $table->text('description')->nullable();
            $table->string('weather')->nullable();
            $table->string('best_time_to_visit')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // 2. Tours
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained('destinations')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Adventure');
            $table->integer('duration_days')->default(5);
            $table->integer('duration_nights')->default(4);
            $table->integer('group_size_max')->default(20);
            $table->enum('difficulty', ['Easy', 'Moderate', 'Challenging', 'Strenuous'])->default('Moderate');
            $table->decimal('base_price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->text('overview')->nullable();
            $table->json('highlights')->nullable();
            $table->json('inclusions')->nullable();
            $table->json('exclusions')->nullable();
            $table->string('meeting_point')->nullable();
            $table->decimal('rating', 3, 2)->default(4.90);
            $table->integer('reviews_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'active', 'sold_out', 'archived'])->default('active');
            $table->timestamps();
        });

        // 3. Tour Itineraries
        Schema::create('tour_itineraries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained('tours')->cascadeOnDelete();
            $table->integer('day_number');
            $table->string('title');
            $table->text('description');
            $table->string('meal_plan')->nullable();
            $table->string('hotel_name')->nullable();
            $table->json('activities')->nullable();
            $table->timestamps();
        });

        // 4. Tour Batches (Departure Schedules)
        Schema::create('tour_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained('tours')->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_seats')->default(20);
            $table->integer('available_seats')->default(20);
            $table->decimal('price_override', 10, 2)->nullable();
            $table->string('guide_name')->nullable();
            $table->enum('status', ['open', 'almost_full', 'sold_out', 'completed'])->default('open');
            $table->timestamps();
        });

        // 5. Coupons
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->nullable()->constrained('agencies')->cascadeOnDelete();
            $table->string('code')->unique();
            $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('discount_value', 10, 2);
            $table->decimal('min_spend', 10, 2)->default(0);
            $table->decimal('max_discount', 10, 2)->nullable();
            $table->timestamp('valid_from')->nullable();
            $table->timestamp('valid_to')->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 6. Bookings
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_number')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->foreignId('tour_id')->constrained('tours')->cascadeOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained('tour_batches')->nullOnDelete();
            $table->date('travel_date');
            $table->integer('adults_count')->default(1);
            $table->integer('children_count')->default(0);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->string('coupon_code')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])->default('confirmed');
            $table->enum('payment_status', ['unpaid', 'paid', 'refunded'])->default('paid');
            $table->string('payment_method')->default('credit_card');
            $table->text('special_requests')->nullable();
            $table->string('qr_code_token')->unique();
            $table->timestamps();
        });

        // 7. Booking Passengers
        Schema::create('booking_passengers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('cnic_passport')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other'])->default('Male');
            $table->integer('age')->nullable();
            $table->boolean('is_lead')->default(false);
            $table->string('phone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_passengers');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('tour_batches');
        Schema::dropIfExists('tour_itineraries');
        Schema::dropIfExists('tours');
        Schema::dropIfExists('destinations');
    }
};
