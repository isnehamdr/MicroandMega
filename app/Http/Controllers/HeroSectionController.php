<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeroSectionController extends Controller
{
    public function index(Request $request)
    {
        $heroItems = HeroSection::orderBy('order')->get();
        
        // If it's an API request (axios call), return JSON array
        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json($heroItems);
        }
        
        // Otherwise return Inertia view
        return inertia('AdminPages/HeroSection', ['heroItems' => $heroItems]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'tag'         => 'required|string|max:255',
            'description' => 'required|string',
            'image'       => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'order'       => 'nullable|integer|min:0', // Add order validation
            'is_active'   => 'boolean'
        ]);

        $path = $request->file('image')->store('hero', 'public');

        // Use provided order or calculate next available order
        $order = $request->input('order');
        if ($order === null) {
            $order = (HeroSection::max('order') ?? 0) + 1;
        } else {
            // Shift orders to make room for the new order
            HeroSection::where('order', '>=', $order)->increment('order');
        }

        HeroSection::create([
            'title'       => $request->title,
            'tag'         => $request->tag,
            'description' => $request->description,
            'image'       => $path,
            'button_text' => $request->button_text ?? 'Get Started',
            'button_link' => $request->button_link ?? '/contact',
            'order'       => $order,
            'is_active'   => $request->boolean('is_active', true),
        ]);

        return response()->json(['message' => 'Hero item created successfully'], 201);
    }

    public function update(Request $request, HeroSection $heroSection)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'tag'         => 'required|string|max:255',
            'description' => 'required|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'order'       => 'nullable|integer|min:0', // Add order validation
            'is_active'   => 'boolean'
        ]);

        $oldOrder = $heroSection->order;
        $newOrder = $request->input('order');

        $data = [
            'title'       => $request->title,
            'tag'         => $request->tag,
            'description' => $request->description,
            'button_text' => $request->button_text ?? 'Get Started',
            'button_link' => $request->button_link ?? '/contact',
            'is_active'   => $request->boolean('is_active', true),
        ];

        // Handle order change if provided
        if ($newOrder !== null && $newOrder != $oldOrder) {
            if ($newOrder > $oldOrder) {
                // Moving down: decrement items in between
                HeroSection::where('order', '>', $oldOrder)
                    ->where('order', '<=', $newOrder)
                    ->decrement('order');
            } else if ($newOrder < $oldOrder) {
                // Moving up: increment items in between
                HeroSection::where('order', '>=', $newOrder)
                    ->where('order', '<', $oldOrder)
                    ->increment('order');
            }
            $data['order'] = $newOrder;
        }

        if ($request->hasFile('image')) {
            if ($heroSection->image) {
                Storage::disk('public')->delete($heroSection->image);
            }
            $data['image'] = $request->file('image')->store('hero', 'public');
        }

        $heroSection->update($data);

        return response()->json(['message' => 'Hero item updated successfully']);
    }

    public function destroy(HeroSection $heroSection)
    {
        $deletedOrder = $heroSection->order;
        
        if ($heroSection->image) {
            Storage::disk('public')->delete($heroSection->image);
        }
        $heroSection->delete();
        
        // Reorder remaining items to fill the gap
        HeroSection::where('order', '>', $deletedOrder)->decrement('order');

        return response()->json(['message' => 'Hero item deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:hero_sections,id',
            'items.*.order' => 'required|integer|min:0'
        ]);

        foreach ($request->items as $item) {
            HeroSection::where('id', $item['id'])->update(['order' => $item['order']]);
        }
        
        return response()->json(['success' => true]);
    }
}