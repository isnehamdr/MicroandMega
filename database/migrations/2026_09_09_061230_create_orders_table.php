<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();

            // Nullable so guest checkout works too — adjust to
            // ->constrained()->cascadeOnDelete() if orders should
            // always require a logged-in user.
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->text('shipping_address')->nullable();

            $table->unsignedInteger('subtotal');
            $table->string('coupon_code')->nullable();
            $table->unsignedInteger('discount')->default(0);
            $table->unsignedInteger('shipping_fee')->default(0);
            $table->unsignedInteger('grand_total');

            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled'])
                ->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};