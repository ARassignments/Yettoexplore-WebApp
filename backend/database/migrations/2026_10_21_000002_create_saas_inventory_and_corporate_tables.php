<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for manual inventory & corporate travel SaaS modules.
     */
    public function up(): void
    {
        // 1. Hotels (Manual inventory)
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->foreignId('destination_id')->nullable()->constrained('destinations')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('city');
            $table->string('address')->nullable();
            $table->decimal('star_rating', 2, 1)->default(4.0);
            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->text('description')->nullable();
            $table->json('amenities')->nullable();
            $table->json('policies')->nullable(); // check-in/out, cancellation
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
            $table->timestamps();
        });

        // 2. Hotel Rooms
        Schema::create('hotel_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained('hotels')->cascadeOnDelete();
            $table->string('name'); // e.g. Deluxe Mountain View, Executive Suite
            $table->enum('room_type', ['single', 'double', 'twin', 'triple', 'suite', 'family'])->default('double');
            $table->integer('max_adults')->default(2);
            $table->integer('max_children')->default(1);
            $table->decimal('base_price_per_night', 10, 2);
            $table->integer('total_rooms')->default(10);
            $table->json('amenities')->nullable(); // AC, Mini Bar, Balcony
            $table->json('images')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // 3. Hotel Quotas / Availability Calendar
        Schema::create('hotel_quotas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_room_id')->constrained('hotel_rooms')->cascadeOnDelete();
            $table->date('date');
            $table->integer('total_rooms');
            $table->integer('available_rooms');
            $table->decimal('price_override', 10, 2)->nullable();
            $table->boolean('is_blocked')->default(false);
            $table->timestamps();

            $table->unique(['hotel_room_id', 'date']);
        });

        // 4. Flights (Manual Inventory - NO GDS)
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->string('flight_number'); // e.g. PK-605, PA-201
            $table->string('airline_name');
            $table->string('airline_logo')->nullable();
            $table->string('departure_airport'); // ISB, LHE, KHI, SKD, GIL
            $table->string('departure_city');
            $table->string('arrival_airport');
            $table->string('arrival_city');
            $table->dateTime('departure_time');
            $table->dateTime('arrival_time');
            $table->integer('duration_minutes')->default(60);
            $table->enum('cabin_class', ['Economy', 'Premium Economy', 'Business'])->default('Economy');
            $table->integer('baggage_kg')->default(20);
            $table->decimal('adult_price', 10, 2);
            $table->decimal('child_price', 10, 2)->nullable();
            $table->integer('total_seats')->default(30);
            $table->integer('available_seats')->default(30);
            $table->text('notes')->nullable();
            $table->enum('status', ['scheduled', 'delayed', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });

        // 5. Vehicles (Fleet & Car Rental / Transfers)
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->string('name'); // e.g. Toyota Prado TX 4WD, Hiace Grand Cabin
            $table->string('make')->default('Toyota');
            $table->integer('model_year')->default(2023);
            $table->enum('type', ['sedan', 'suv', 'van', 'coaster', '4x4_jeep'])->default('suv');
            $table->string('license_plate')->nullable();
            $table->integer('seats_capacity')->default(7);
            $table->integer('luggage_capacity')->default(4);
            $table->enum('transmission', ['Automatic', 'Manual'])->default('Automatic');
            $table->enum('fuel_type', ['Petrol', 'Diesel', 'Hybrid'])->default('Diesel');
            $table->decimal('daily_rate', 10, 2);
            $table->boolean('with_driver')->default(true);
            $table->string('cover_image')->nullable();
            $table->json('features')->nullable(); // AC, 4x4 Low/High, Bluetooth
            $table->enum('status', ['available', 'rented', 'maintenance'])->default('available');
            $table->timestamps();
        });

        // 6. Drivers
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('full_name');
            $table->string('phone');
            $table->string('license_number')->nullable();
            $table->integer('experience_years')->default(5);
            $table->decimal('rating', 2, 1)->default(4.9);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        // 7. Corporate Accounts
        Schema::create('corporate_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->string('company_name');
            $table->string('company_code')->unique();
            $table->string('ntn_tax_id')->nullable();
            $table->string('contact_name');
            $table->string('contact_email');
            $table->string('contact_phone')->nullable();
            $table->text('address')->nullable();
            $table->decimal('credit_limit', 12, 2)->default(500000.00);
            $table->decimal('current_balance', 12, 2)->default(0.00);
            $table->decimal('discount_rate_percentage', 5, 2)->default(5.00);
            $table->boolean('requires_approval')->default(true);
            $table->enum('status', ['active', 'suspended', 'closed'])->default('active');
            $table->timestamps();
        });

        // 8. Invoices & Billing
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('agency_id')->constrained('agencies')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('corporate_account_id')->nullable()->constrained('corporate_accounts')->nullOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->string('title');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('tax_amount', 12, 2)->default(0.00);
            $table->decimal('discount_amount', 12, 2)->default(0.00);
            $table->decimal('total_amount', 12, 2);
            $table->string('currency', 3)->default('PKR');
            $table->date('due_date');
            $table->enum('status', ['unpaid', 'paid', 'partially_paid', 'overdue', 'cancelled'])->default('unpaid');
            $table->string('payment_method')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('corporate_accounts');
        Schema::dropIfExists('drivers');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('flights');
        Schema::dropIfExists('hotel_quotas');
        Schema::dropIfExists('hotel_rooms');
        Schema::dropIfExists('hotels');
    }
};
