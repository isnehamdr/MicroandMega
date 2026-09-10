<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // 'in_stock', 'out_of_stock', 'low_stock' — enum keeps room to grow
            // beyond a plain boolean without another migration later.
            $table->enum('stock_status', ['in_stock', 'low_stock', 'out_of_stock'])
                ->default('in_stock')
                ->nullable()
                ->after('status');

            $table->decimal('price', 10, 2)
                ->default(0)
                ->after('stock_status');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['stock_status', 'price']);
        });
    }
};