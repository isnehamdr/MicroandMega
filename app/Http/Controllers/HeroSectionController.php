<?php

namespace App\Http\Controllers;

use App\Models\HeroSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeroSectionController extends Controller
{
    public function index()
    {
        $heroItems = HeroSection::orderBy('order')->get();
        return inertia('Admin/HeroSection', ['heroItems' => $heroItems]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'tag' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'button_text' => 'nullable|string',
            'button_link' => 'nullable|string',
        ]);

        $path = $request->file('image')->store('hero', 'public');

        HeroSection::create([
            'title' => $request->title,
            'tag' => $request->tag,
            'description' => $request->description,
            'image' => $path,
            'button_text' => $request->button_text ?? 'Get Started',
            'button_link' => $request->button_link ?? '/contact',
            'order' => HeroSection::max('order') + 1,
            'is_active' => $request->has('is_active'),
        ]);

        return redirect()->back()->with('success', 'Hero item created successfully');
    }

    public function show(HeroSection $heroSection)
    {
        //
    }

    public function edit(HeroSection $heroSection)
    {
        //
    }

    public function update(Request $request, HeroSection $heroSection)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'tag' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'button_text' => 'nullable|string',
            'button_link' => 'nullable|string',
        ]);

        $data = [
            'title' => $request->title,
            'tag' => $request->tag,
            'description' => $request->description,
            'button_text' => $request->button_text ?? 'Get Started',
            'button_link' => $request->button_link ?? '/contact',
            'is_active' => $request->has('is_active'),
        ];

        if ($request->hasFile('image')) {
            // Delete old image
            if ($heroSection->image) {
                Storage::disk('public')->delete($heroSection->image);
            }
            $data['image'] = $request->file('image')->store('hero', 'public');
        }

        $heroSection->update($data);

        return redirect()->back()->with('success', 'Hero item updated successfully');
    }

    public function destroy(HeroSection $heroSection)
    {
        if ($heroSection->image) {
            Storage::disk('public')->delete($heroSection->image);
        }
        $heroSection->delete();
        
        return redirect()->back()->with('success', 'Hero item deleted successfully');
    }

    public function reorder(Request $request)
    {
        foreach ($request->items as $item) {
            HeroSection::where('id', $item['id'])->update(['order' => $item['order']]);
        }
        return response()->json(['success' => true]);
    }
}