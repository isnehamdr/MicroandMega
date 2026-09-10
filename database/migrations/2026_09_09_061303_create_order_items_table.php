<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();

            // nullOnDelete so a deleted product doesn't wipe out order history
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();

            // Snapshot fields — captured at order time so later product
            // edits (price, name) never rewrite historical orders.
            $table->string('product_name');
            $table->string('product_image')->nullable();
            $table->unsignedInteger('price');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('line_total');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};