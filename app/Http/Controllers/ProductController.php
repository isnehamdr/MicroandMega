<?php

// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as LaravelLog;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
 public function showPage($slug)
    {
        try {
            $product = Product::with('category', 'images')
                ->where('slug', $slug)
                ->firstOrFail();

            return Inertia::render('ProductDetailPage', [
                'productSlug' => $slug,
                'seo' => [
                    'title'       => ($product->title ?: $product->name) . ' | Micro & Mega',
                    'description' => $product->description
                                        ?: 'View details for ' . $product->name . ' by Micro & Mega Nepal.',
                    'url'         => url("/category/{$slug}"),
                    'image'       => $product->featured_image
                                        ? env('VITE_IMAGE_PATH') . '/' . $product->featured_image
                                        : null,
                ],
            ]);
        } catch (\Exception $e) {
            abort(404);
        }
    }


    // Get all products
    public function index()
    {
        try {
            $products = Product::with('category', 'images')->latest()->get();

            return response()->json([
                'status' => true,
                'data' => $products,
                'message' => 'Products fetched successfully',
            ]);
        } catch (\Exception $e) {
            LaravelLog::error('Error fetching products: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Error fetching products: '.$e->getMessage(),
            ], 500);
        }
    }

    // Get products by category
    public function getByCategory($categorySlug)
    {
        try {
            $category = ProductCategory::where('slug', $categorySlug)->first();

            if (! $category) {
                return response()->json([
                    'status' => false,
                    'message' => 'Category not found',
                ], 404);
            }

            $products = Product::with('category', 'images')
                ->where('product_category_id', $category->id)
                ->where('status', true)
                ->latest()
                ->get();

            return response()->json([
                'status' => true,
                'data' => $products,
                'category' => $category,
            ]);
        } catch (\Exception $e) {
            LaravelLog::error('Error fetching products by category: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Error fetching products: '.$e->getMessage(),
            ], 500);
        }
    }

    // Get single product by slug
    public function show($slug)
    {
        try {
            $product = Product::with('category', 'images')
                ->where('slug', $slug)
                ->firstOrFail();

            return response()->json([
                'status' => true,
                'data' => $product,
            ]);
        } catch (\Exception $e) {
            LaravelLog::error('Error fetching product: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Product not found',
            ], 404);
        }
    }



public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'title' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
    'product_category_id' => 'required|exists:product_categories,id', // ← changed
            'status' => 'boolean',
            'stock_status' => 'nullable|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'price'=> 'required|numeric|min:0',
        ]);

        $featuredImagePath = null;
        if ($request->hasFile('featured_image')) {
            $featuredImagePath = $request->file('featured_image')->store('products', 'public');
        }

        $product = Product::create([
            
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'title' => $validated['title'] ?? null,
            'content' => $validated['content'] ?? null,
            'featured_image' => $featuredImagePath,
    'product_category_id' => $validated['product_category_id'], // ← changed
            'status' => $validated['status'] ?? true,
            'stock_quantity'      => $validated['stock_quantity'] ?? 0,
'low_stock_threshold' => $validated['low_stock_threshold'] ?? 5,
'price'               => $validated['price'],
        ]);


        $product->recomputeStockStatus();
$product->save();

        
        // Handle multiple images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imagePath = $image->store('product-images', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        // Log product creation
        \App\Models\Log::create([
            'name' => auth()->user()?->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title' => 'Product Created: ' . $product->name,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully',
            'data' => $product->load('images'),
        ], 201);

    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Error creating product: ' . $e->getMessage());
        
        return response()->json([
            'status' => false,
            'message' => 'Error creating product: ' . $e->getMessage(),
        ], 500);
    }
}

    // Update product
  // In ProductController.php, update the update method:

public function update(Request $request, $id)
{
    try {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'title' => 'nullable|string',
            'content' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
    'product_category_id' => 'required|exists:product_categories,id', // ← changed
            'status' => 'boolean',
            'stock_quantity'      => 'nullable|integer|min:0',
'low_stock_threshold' => 'nullable|integer|min:0',
'price'               => 'sometimes|numeric|min:0',
        ]);

        // Update featured image if provided
        if ($request->hasFile('featured_image')) {
            if ($product->featured_image && Storage::disk('public')->exists($product->featured_image)) {
                Storage::disk('public')->delete($product->featured_image);
            }
            $product->featured_image = $request->file('featured_image')->store('products', 'public');
        }

        // Update slug if name changed
        $updateData = [
            'name' => $request->name ?? $product->name,
            'description' => $request->description ?? $product->description,
            'title' => $request->title ?? $product->title,
            'content' => $request->content ?? $product->content,
    'product_category_id' => $request->product_category_id,
            'status' => $request->status ?? $product->status,
            'stock_quantity'      => $request->stock_quantity ?? $product->stock_quantity,
'low_stock_threshold' => $request->low_stock_threshold ?? $product->low_stock_threshold,
'price'               => $request->price ?? $product->price,
        ];
        
        $product->update($updateData);
        $product->recomputeStockStatus();
$product->save();

        // Handle new images if provided
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imagePath = $image->store('product-images', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                    'is_primary' => false,
                    'sort_order' => $product->images()->count() + $index,
                ]);
            }
        }

        // Log product update
        \App\Models\Log::create([
            'name' => auth()->user()?->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title' => 'Product Updated: ' . $product->name,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
            'data' => $product->load('images'),
        ]);

    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Error updating product: ' . $e->getMessage());
        
        return response()->json([
            'status' => false,
            'message' => 'Error updating product: ' . $e->getMessage(),
        ], 500);
    }
}

    // Delete product
    public function destroy(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            // Capture name before deletion for the log
            $productName = $product->name;

            if ($product->featured_image && Storage::disk('public')->exists($product->featured_image)) {
                Storage::disk('public')->delete($product->featured_image);
            }

            foreach ($product->images as $image) {
                if (Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
                $image->delete();
            }

            $product->delete();

            // Log product deletion
            Log::create([
                'name' => auth()->user()?->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title' => 'Product Deleted: '.$productName,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Product deleted successfully',
            ]);

        } catch (\Exception $e) {
            LaravelLog::error('Error deleting product: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Error deleting product: '.$e->getMessage(),
            ], 500);
        }
    }



    // PATCH /ourproducts/{id}/restock
public function restock(Request $request, $id)
{
    try {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product->stock_quantity = $validated['stock_quantity'];
        $product->recomputeStockStatus();
        $product->save();

        \App\Models\Log::create([
            'name'       => auth()->user()?->name ?? 'Guest',
            'ip_address' => $request->ip(),
            'title'      => "Product Restocked: {$product->name} → {$product->stock_quantity} units",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Stock updated successfully',
            'data'    => $product->fresh(),
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
    }
}
}
