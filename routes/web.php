<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\HeroSectionController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ServiceTicketController;
use Illuminate\Support\Facades\Response;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Product;
use App\Models\Project;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


   
        Route::get('/category', function () {
    return Inertia::render('AdminPages/Category');
});

    Route::get('/products', function () {
    return Inertia::render('AdminPages/Products');
});
    Route::get('/projects', function () {
    return Inertia::render('AdminPages/Projects');
});
    Route::get('/testimonials', function () {
    return Inertia::render('AdminPages/Testimonials');
});

    Route::get('/service-tickets', function () {
    return Inertia::render('AdminPages/ServiceTicket');
});

  Route::get('/hero-section', function () {
    return Inertia::render('AdminPages/HeroSection');
});


   Route::get('/hero-section', [HeroSectionController::class, 'index'])->name('admin.hero');
    Route::post('/hero', [HeroSectionController::class, 'store'])->name('admin.hero.store');
    Route::put('/hero/{heroSection}', [HeroSectionController::class, 'update'])->name('admin.hero.update');
    Route::delete('/hero/{heroSection}', [HeroSectionController::class, 'destroy'])->name('admin.hero.destroy');
    Route::post('/hero/reorder', [HeroSectionController::class, 'reorder'])->name('admin.hero.reorder');




    Route::post('/ourprojects', [ProjectController::class, 'store'])->name('ourprojects.store');
    Route::put('/ourprojects/{id}', [ProjectController::class, 'update'])->name('ourprojects.update');
    Route::delete('/ourprojects/{id}', [ProjectController::class, 'destroy'])->name('ourprojects.destroy');
  
  
    // ── Products ──────────────────────────────────────────────────────────

   Route::post('/ourproducts', [ProductController::class, 'store'])
        ->name('ourproducts.store');
    Route::put('/ourproducts/{id}', [ProductController::class, 'update'])
        ->name('ourproducts.update');
    Route::delete('/ourproducts/{id}', [ProductController::class, 'destroy'])
        ->name('ourproducts.destroy');

        

    // Product Categories (Admin)
    Route::prefix('ourproductcategories')->group(function () {
        Route::post('/', [ProductCategoryController::class, 'store'])->name('ourproductcategories.store');
        Route::post('/{id}', [ProductCategoryController::class, 'update'])->name('ourproductcategories.update');
        Route::delete('/{id}', [ProductCategoryController::class, 'destroy'])->name('ourproductcategories.destroy');
        Route::delete('/{id}/images/{imageId}', [ProductCategoryController::class, 'destroyImage'])
            ->name('ourproductcategories.images.destroy');
    });
    

     Route::get('/ourproductcategories', [ProductCategoryController::class, 'index'])->name('ourproductcategories.index');       
    Route::post('/ourproductcategories', [ProductCategoryController::class, 'store'])->name('ourproductcategories.store');      
    Route::put('/ourproductcategories/{id}', [ProductCategoryController::class, 'update'])->name('ourproductcategories.update'); 
    Route::delete('/ourproductcategories/{id}', [ProductCategoryController::class, 'destroy'])->name('ourproductcategories.destroy'); 
  

     // ── Testimonials ──────────────────────────────────────────────────────
    Route::post('/ourtestimonials',                [TestimonialController::class, 'store'])  ->name('ourtestimonials.store');
    Route::put('/ourtestimonials/{id}',   [TestimonialController::class, 'update']) ->name('ourtestimonials.update');
    Route::delete('/ourtestimonials/{id}',[TestimonialController::class, 'destroy'])->name('ourtestimonials.destroy');

     // ── Users ──────────────────────────────────────────────────────

        Route::get('/user',function(){
        return Inertia::render('AdminPages/UserManagement');
    });
    Route::get('/ourusers', [UserController::class, 'index'])->name('ourusers.index');       
    Route::post('/ourusers', [UserController::class, 'store'])->name('ourusers.store');      
    Route::put('/ourusers/{id}', [UserController::class, 'update'])->name('ourusers.update'); 
    Route::delete('/ourusers/{id}', [UserController::class, 'destroy'])->name('ourusers.destroy'); 
    

     // ── Activity Log──────────────────────────────────────────────────────
        Route::get('/log',function(){
        return Inertia::render('AdminPages/ActivityLog');
    });
    Route::get('/logs', [LogController::class, 'index'])->name('logs.index');  

    // Service Tickets (Admin)
    
    Route::get('/ourservicetickets', [ServiceTicketController::class, 'index'])->name('ourservicetickets.index');
Route::put('/ourservicetickets/{id}', [ServiceTicketController::class, 'update'])->name('ourservicetickets.update');   // ← ADD THIS

   
});




// Public Project Routes (API)
Route::get('/ourprojects', [ProjectController::class, 'index'])->name('ourprojects.index');
Route::get('/ourprojects/{slug}', [ProjectController::class, 'show'])->name('ourprojects.show');

// Public Product Routes (API)
// ── Products ──────────────────────────────────────────────────
Route::get('/ourproducts', [ProductController::class, 'index'])
    ->name('ourproducts.index');
Route::get('/ourproducts/category/{categorySlug}', [ProductController::class, 'getByCategory'])
    ->name('ourproducts.by-category');          // ← MUST come before /{slug}
Route::get('/ourproducts/{slug}', [ProductController::class, 'show'])
    ->name('ourproducts.show');

// Public Product Categories (API)
Route::prefix('ourproductcategories')->group(function () {
    Route::get('/', [ProductCategoryController::class, 'index'])->name('ourproductcategories.index');
    Route::get('/flat', [ProductCategoryController::class, 'flat'])->name('ourproductcategories.flat');
    Route::get('/{slug}', [ProductCategoryController::class, 'show'])->name('ourproductcategories.show');
});

// Route::get('/category/{categorySlug}', function ($categorySlug) {
//     return Inertia::render('ProductDetailPage', ['categorySlug' => $categorySlug]);
// })->name('products.category');

// Route::get('/products/{slug}', function ($slug) {
//     return Inertia::render('ProductDetailPage', ['productSlug' => $slug]);
// })->name('products.show');

Route::get('/category/{categorySlug}', [ProductCategoryController::class, 'showPage'])->name('products.category');
Route::get('/products/{slug}',         [ProductController::class, 'showPage'])->name('products.show');




// Public Testimonials Routes (API)
Route::get('/ourtestimonials', [TestimonialController::class, 'index'])->name('ourtestimonials.index');

// Product Detail Pages (public)


    Route::get('/about',function(){
        return Inertia::render('About');
    });

 


     Route::get('/service',function(){
        return Inertia::render('Service');
    });


   Route::get('/projects-page', function () {
    return Inertia::render('ProjectsPage');
})->name('projects.page');

// Route::get('/project-details/{slug}', function ($slug) {
//     return Inertia::render('ProjectDetailPage', ['slug' => $slug]);
// })->name('project.details');


Route::get('/project-details/{slug}', [ProjectController::class, 'showPage'])->name('project.details');




      Route::get('/contact',function(){
        return Inertia::render('ContactUs');
    });

    
      Route::get('/product-details',function(){
        return Inertia::render('ProductDetailPage');
    });


      Route::get('/service-ticket',function(){
        return Inertia::render('ServiceTicket');
    });


// Service Ticket submission (public)
Route::post('/service-tickets', [ServiceTicketController::class, 'store'])->name('service-tickets.store');


   Route::get('/add-to-cart',function(){
        return Inertia::render('AddToCart');
    });






// robots.txt
Route::get('/robots.txt', function () {

    // Block everything in local environment
    if (app()->environment('local')) {
        return response("User-agent: *\nDisallow: /", 200)
            ->header('Content-Type', 'text/plain');
    }

$content = "User-agent: *\n";
$content .= "Allow: /\n\n";
$content .= "Sitemap: " . url('/sitemap.xml') . "\n";

    $content .= "Disallow: /admin\n";
    $content .= "Disallow: /login\n";
    $content .= "Disallow: /dashboard\n";
    $content .= "Disallow: /storage\n";
    $content .= "Disallow: /vendor\n\n";

    $content .= "Sitemap: " . url('/sitemap.xml') . "\n";

    return response($content, 200)
        ->header('Content-Type', 'text/plain');
});


// llms.txt
Route::get('/llms.txt', function () {

    $content = "# LLMs.txt for Micro & Mega\n\n";

    $content .= "User-agent: *\n";
    $content .= "Allow: /\n\n";
    

    $content .= "Site-Name: Micro & Mega\n";
    $content .= "Site-URL: " . url('/') . "\n";
    $content .= "Description: Micro & Mega provides advanced security systems, industrial products, and technical services.\n\n";

    $content .= "Focus: Security Systems, Industrial Products, Services, Projects\n\n";

    $content .= "Preferred-Content:\n";
    $content .= "- Product pages\n";
    $content .= "- Service pages\n";
    $content .= "- Project case studies\n\n";

    $content .= "Avoid:\n";
    $content .= "- Admin pages\n";
    $content .= "- Login areas\n\n";

    $content .= "Contact: " . url('/contact') . "\n";
    $content .= "Sitemap: " . url('/sitemap.xml') . "\n";

    return response($content, 200)
        ->header('Content-Type', 'text/plain');
});


// Sitemap route
Route::get('/sitemap.xml', function () {
    $sitemap = Sitemap::create();

    // Static Pages
    $sitemap->add(
        Url::create('/')
            ->setPriority(1.0)
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
    );

    $sitemap->add('/about');
    $sitemap->add('/service');
    $sitemap->add('/contact');

    // Dynamic Products
    $products = Product::all();
    foreach ($products as $product) {
        $sitemap->add(
            Url::create("/products/{$product->slug}")
                ->setLastModificationDate($product->updated_at)
                ->setPriority(0.9)
        );
    }

    // Dynamic Projects
    $projects = Project::all();
    foreach ($projects as $project) {
        $sitemap->add(
            Url::create("/project-details/{$project->slug}")
                ->setLastModificationDate($project->updated_at)
                ->setPriority(0.8)
        );
    }

    // Return response
    return response($sitemap->render(), 200)
        ->header('Content-Type', 'application/xml');
})->name('sitemap');




require __DIR__.'/auth.php';
