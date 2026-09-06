<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as LaravelLog;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    // GET /ourproductcategories — all categories (nested tree)

    public function showPage($slug)
    {
        try {
            $category = ProductCategory::where('slug', $slug)
                ->where('status', true)
                ->firstOrFail();

            return Inertia::render('ProductDetailPage', [
                'categorySlug' => $slug,
                'seo' => [
                    'title'       => ($category->title ?: $category->name) . ' | Micro & Mega',
                    'description' => $category->description
                                        ?: 'Explore ' . $category->name . ' security products by Micro & Mega Nepal.',
                    'url'         => url("/category/{$slug}"),
                    'image'       => $category->featured_image
                                        ? env('VITE_IMAGE_PATH') . '/' . $category->featured_image
                                        : null,
                ],
            ]);
        } catch (\Exception $e) {
            abort(404);
        }
    }

    public function index()
    {
        try {
            $categories = ProductCategory::with([
                'children' => function ($query) {
                    $query->orderBy('order', 'asc');
                }
            ])
            ->whereNull('parent_id')
            ->where('status', true)
            ->orderBy('order', 'asc')
            ->get();

            return response()->json([
                'status'  => true,
                'data'    => $categories,
                'message' => 'Product categories fetched successfully',
            ]);
        } catch (\Exception $e) {
            LaravelLog::error('Error fetching product categories: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /ourproductcategories/flat — flat list for dropdowns (admin)
    public function flat()
    {
        try {
            $categories = ProductCategory::with('parent')
                ->orderBy('order', 'asc')
                ->orderBy('name', 'asc')
                ->get()
                ->map(fn($c) => [
                    'id'              => $c->id,
                    'name'            => $c->name,
                    'slug'            => $c->slug,
                    'parent_id'       => $c->parent_id,
                    'parent_name'     => $c->parent?->name,
                    'icon_image'      => $c->icon_image,
                    'featured_image'  => $c->featured_image,
                    'gallery_images'  => $c->gallery_images ?? [],
                    'order'           => $c->order,
                    'status'          => $c->status,
                ]);

            return response()->json(['status' => true, 'data' => $categories]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // GET /ourproductcategories/{slug} — single category + its products
    public function show($slug)
    {
        try {
            $category = ProductCategory::with(['children', 'products.images'])
                ->where('slug', $slug)
                ->where('status', true)
                ->firstOrFail();

            return response()->json([
                'status' => true,
                'data'   => $category,
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Category not found'], 404);
        }
    }

    /**
     * Insert a category into its sibling group's order sequence at the
     * requested position, then renumber the whole group sequentially
     * (0, 1, 2, ...). This is what makes typing an "Order" value behave
     * the same way dragging does — it repositions rather than just
     * overwriting a single row's number (which can collide with a sibling
     * and silently do nothing visible).
     *
     * $desiredOrder: 0-based target position within the group.
     *                Pass PHP_INT_MAX (or omit) to push to the end.
     */
    private function normalizeOrderForGroup($parentId, $categoryId, $desiredOrder)
    {
        // All siblings in this parent group, excluding the one being placed
        $siblingIds = ProductCategory::where('parent_id', $parentId)
            ->where('id', '!=', $categoryId)
            ->orderBy('order')
            ->orderBy('id')
            ->pluck('id')
            ->toArray();

        // Clamp desired position into valid range [0, count]
        $desiredOrder = max(0, min((int) $desiredOrder, count($siblingIds)));

        // Insert the category id at that position
        array_splice($siblingIds, $desiredOrder, 0, [$categoryId]);

        // Renumber the whole group sequentially so there are never ties
        foreach ($siblingIds as $index => $id) {
            ProductCategory::where('id', $id)->update(['order' => $index]);
        }
    }

    // POST /ourproductcategories — create
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'          => 'required|string|max:255',
                'slug'          => 'nullable|string|unique:product_categories,slug',
                'description'   => 'nullable|string',
                'title'         => 'nullable|string',
                'content'       => 'nullable|string',
                'featured_image'=> 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'icon_image'    => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:1024',
                'gallery_images' => 'nullable|array',
                'gallery_images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'parent_id'     => 'nullable|exists:product_categories,id',
                'order'         => 'nullable|integer|min:0',
                'status'        => 'boolean',
            ]);

            $featuredPath = null;
            if ($request->hasFile('featured_image')) {
                $featuredPath = $request->file('featured_image')
                    ->store('product-categories/featured', 'public');
            }

            $iconPath = null;
            if ($request->hasFile('icon_image')) {
                $iconPath = $request->file('icon_image')
                    ->store('product-categories/icons', 'public');
            }

            // Handle gallery images - store as JSON array
            $galleryPaths = [];
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $image) {
                    $path = $image->store('product-categories/gallery', 'public');
                    $galleryPaths[] = $path;
                }
            }

            $category = ProductCategory::create([
                'name'           => $validated['name'],
                'slug'           => $validated['slug'] ?? null,
                'description'    => $validated['description'] ?? null,
                'title'          => $validated['title'] ?? null,
                'content'        => $validated['content'] ?? null,
                'featured_image' => $featuredPath,
                'icon_image'     => $iconPath,
                'gallery_images' => $galleryPaths,
                'parent_id'      => $validated['parent_id'] ?? null,
                // Temp value — normalizeOrderForGroup() below fixes it up
                // and resolves any collision with existing siblings.
                'order'          => $validated['order'] ?? 0,
                'status'         => $validated['status'] ?? true,
            ]);

            // Reposition within the sibling group based on the requested
            // order value (or push to the end if none was given).
            $desiredOrder = array_key_exists('order', $validated) && $validated['order'] !== null
                ? (int) $validated['order']
                : PHP_INT_MAX;
            $this->normalizeOrderForGroup($category->parent_id, $category->id, $desiredOrder);
            $category->refresh();

            Log::create([
                'name'       => auth()->user()?->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => 'Product Category Created: ' . $category->name,
            ]);

            return response()->json([
                'status'  => true,
                'message' => 'Product category created successfully',
                'data'    => $category,
            ], 201);

        } catch (\Exception $e) {
            LaravelLog::error('Error creating product category: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /ourproductcategories/{id} (with _method=PUT) — update
    public function update(Request $request, $id)
    
    {
         \Log::info('UPDATE HIT with id: ' . $id . ' | route name: ' . optional($request->route())->getName());
        try {
            $category = ProductCategory::findOrFail($id);

            $validated = $request->validate([
                'name'          => 'sometimes|string|max:255',
                'slug'          => 'nullable|string|unique:product_categories,slug,' . $id,
                'description'   => 'nullable|string',
                'title'         => 'nullable|string',
                'content'       => 'nullable|string',
                'featured_image'=> 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'icon_image'    => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:1024',
                'gallery_images' => 'nullable|array',
                'gallery_images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'remove_gallery_images' => 'nullable|array',
                'remove_gallery_images.*' => 'integer',
                'parent_id'     => 'nullable|exists:product_categories,id',
                'order'         => 'nullable|integer|min:0',
                'status'        => 'boolean',
            ]);

            // Prevent a category from being its own parent
            if (isset($validated['parent_id']) && $validated['parent_id'] == $id) {
                return response()->json([
                    'status'  => false,
                    'message' => 'A category cannot be its own parent.',
                ], 422);
            }

            // Handle featured image
            if ($request->hasFile('featured_image')) {
                if ($category->featured_image && Storage::disk('public')->exists($category->featured_image)) {
                    Storage::disk('public')->delete($category->featured_image);
                }
                $featuredPath = $request->file('featured_image')
                    ->store('product-categories/featured', 'public');
                $category->featured_image = $featuredPath;
            }

            // Handle icon image
            if ($request->hasFile('icon_image')) {
                if ($category->icon_image && Storage::disk('public')->exists($category->icon_image)) {
                    Storage::disk('public')->delete($category->icon_image);
                }
                $iconPath = $request->file('icon_image')
                    ->store('product-categories/icons', 'public');
                $category->icon_image = $iconPath;
            }

            // Handle removal of specific gallery images
            $currentGallery = $category->gallery_images ?? [];
            if ($request->has('remove_gallery_images')) {
                $toRemove = $request->remove_gallery_images;
                $remaining = [];

                foreach ($currentGallery as $index => $imagePath) {
                    if (!in_array($index, $toRemove)) {
                        $remaining[] = $imagePath;
                    } else {
                        // Delete the image file
                        if (Storage::disk('public')->exists($imagePath)) {
                            Storage::disk('public')->delete($imagePath);
                        }
                    }
                }
                $currentGallery = $remaining;
            }

            // Handle new gallery images
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $image) {
                    $path = $image->store('product-categories/gallery', 'public');
                    $currentGallery[] = $path;
                }
            }

            // Track whether the parent group is changing, so we know which
            // group to normalize the order against afterwards.
            $newParentId = array_key_exists('parent_id', $validated)
                ? $validated['parent_id']
                : $category->parent_id;

            // Update category
            $category->update([
                'name'           => $request->name ?? $category->name,
                'slug'           => $validated['slug'] ?? $category->slug,
                'description'    => $request->description ?? $category->description,
                'title'          => $request->title ?? $category->title,
                'content'        => $request->content ?? $category->content,
                'gallery_images' => $currentGallery,
                'parent_id'      => $newParentId,
                'order'          => array_key_exists('order', $validated)
                                        ? $validated['order']
                                        : $category->order,
                'status'         => $request->has('status') ? $request->status : $category->status,
            ]);

            // Reposition within the (possibly new) sibling group so the
            // typed Order value actually moves the row instead of just
            // colliding silently with an existing sibling's order.
            $desiredOrder = array_key_exists('order', $validated) && $validated['order'] !== null
                ? (int) $validated['order']
                : PHP_INT_MAX;
            $this->normalizeOrderForGroup($category->parent_id, $category->id, $desiredOrder);
            $category->refresh();

            Log::create([
                'name'       => auth()->user()?->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => 'Product Category Updated: ' . $category->name,
            ]);

            return response()->json([
                'status'  => true,
                'message' => 'Product category updated successfully',
                'data'    => $category->fresh()->load('parent', 'children'),
            ]);

        } catch (\Exception $e) {
            LaravelLog::error('Error updating product category: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // DELETE /ourproductcategories/{id}
    public function destroy(Request $request, $id)
    {
        try {
            $category = ProductCategory::findOrFail($id);
            $name     = $category->name;

            // Check if category has child categories
            if ($category->children()->count() > 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Cannot delete category with child categories. Delete child categories first.'
                ], 422);
            }

            // Delete featured image
            if ($category->featured_image && Storage::disk('public')->exists($category->featured_image)) {
                Storage::disk('public')->delete($category->featured_image);
            }

            // Delete icon
            if ($category->icon_image && Storage::disk('public')->exists($category->icon_image)) {
                Storage::disk('public')->delete($category->icon_image);
            }

            // Delete all gallery images
            if (!empty($category->gallery_images)) {
                foreach ($category->gallery_images as $imagePath) {
                    if (Storage::disk('public')->exists($imagePath)) {
                        Storage::disk('public')->delete($imagePath);
                    }
                }
            }

            // Detach products (set product_category_id to null instead of deleting)
            Product::where('product_category_id', $id)->update(['product_category_id' => null]);

            $category->delete(); // soft delete

            Log::create([
                'name'       => auth()->user()?->name ?? 'Guest',
                'ip_address' => $request->ip(),
                'title'      => 'Product Category Deleted: ' . $name,
            ]);

            return response()->json(['status' => true, 'message' => 'Product category deleted successfully']);

        } catch (\Exception $e) {
            LaravelLog::error('Error deleting product category: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // DELETE /ourproductcategories/{id}/gallery/{index} — remove one gallery image
    public function destroyGalleryImage(Request $request, $id, $index)
    {
        try {
            $category = ProductCategory::findOrFail($id);
            $galleryImages = $category->gallery_images ?? [];

            if (!isset($galleryImages[$index])) {
                return response()->json(['status' => false, 'message' => 'Image not found'], 404);
            }

            $imagePath = $galleryImages[$index];

            // Delete the file
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            // Remove from array
            unset($galleryImages[$index]);
            $category->gallery_images = array_values($galleryImages); // Reindex array
            $category->save();

            return response()->json(['status' => true, 'message' => 'Image deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /ourproductcategories/reorder — persist drag-and-drop order
    // Expects: { "items": [{ "id": 1, "order": 0 }, { "id": 2, "order": 1 }, ...] }
    // All items in a single request are assumed to belong to the same
    // parent group (this matches the frontend's per-group drag behavior).
    // public function reorder(Request $request)
    // {
        
    //     try {
    //         $validated = $request->validate([
    //             'items'            => 'required|array|min:1',
    //             'items.*.id'       => 'required|integer|exists:product_categories,id',
    //             'items.*.order'    => 'required|integer|min:0',
    //         ]);

    //         foreach ($validated['items'] as $item) {
    //             ProductCategory::where('id', $item['id'])->update(['order' => $item['order']]);
    //         }

    //         return response()->json([
    //             'status'  => true,
    //             'message' => 'Order updated successfully',
    //         ]);
    //     } catch (\Exception $e) {
    //         LaravelLog::error('Error reordering product categories: ' . $e->getMessage());
    //         return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
    //     }
    // }


    public function reorder(Request $request)
{
    LaravelLog::info('REORDER PAYLOAD', $request->all());

    try {
        $validated = $request->validate([
            'items'            => 'required|array|min:1',
            'items.*.id'       => 'required|integer|exists:product_categories,id',
            'items.*.order'    => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            ProductCategory::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Order updated successfully',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        LaravelLog::error('Reorder VALIDATION error: ' . json_encode($e->errors()));
        return response()->json(['status' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        LaravelLog::error('Error reordering product categories: ' . $e->getMessage() . ' | ' . $e->getFile() . ':' . $e->getLine());
        return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
    }
}
}