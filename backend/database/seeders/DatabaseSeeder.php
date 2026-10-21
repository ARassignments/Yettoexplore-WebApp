<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Booking;
use App\Models\BookingPassenger;
use App\Models\Coupon;
use App\Models\Destination;
use App\Models\Tour;
use App\Models\TourBatch;
use App\Models\TourItinerary;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with SaaS demo accounts, tours, itineraries, batches, and bookings.
     */
    public function run(): void
    {
        // 1. Create Agencies
        $northVoyagers = Agency::create([
            'name' => 'NorthVoyagers Pakistan',
            'slug' => 'north-voyagers-pakistan',
            'logo' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=200&q=80',
            'cover_image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            'email' => 'contact@northvoyagers.pk',
            'phone' => '+92 300 8555123',
            'address' => 'Floor 3, Executive Heights, Blue Area',
            'city' => 'Islamabad',
            'license_number' => 'DTS-ISB-2024-889',
            'rating' => 4.95,
            'total_reviews' => 342,
            'is_verified' => true,
            'commission_rate' => 10.00,
            'subscription_tier' => 'pro',
            'status' => 'active',
        ]);

        $karakoramExp = Agency::create([
            'name' => 'Karakoram Expeditions',
            'slug' => 'karakoram-expeditions',
            'logo' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
            'cover_image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            'email' => 'info@karakoramexpeditions.com',
            'phone' => '+92 312 9900881',
            'address' => 'River Road, Main Bazaar',
            'city' => 'Skardu',
            'license_number' => 'DTS-GB-2023-112',
            'rating' => 4.88,
            'total_reviews' => 195,
            'is_verified' => true,
            'commission_rate' => 8.50,
            'subscription_tier' => 'starter',
            'status' => 'active',
        ]);

        // 2. Create Users with All Platform Roles
        $admin = User::create([
            'name' => 'Faraz Ahmed (Platform Admin)',
            'email' => 'admin@yettoexplore.com',
            'phone' => '+92 300 1112233',
            'role' => 'super_admin',
            'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            'password' => Hash::make('password123'),
            'is_active' => true,
        ]);

        $agencyOwner = User::create([
            'name' => 'Babar Azam (Agency Partner)',
            'email' => 'agency@yettoexplore.com',
            'phone' => '+92 300 8555123',
            'role' => 'agency_owner',
            'agency_id' => $northVoyagers->id,
            'avatar' => 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
            'password' => Hash::make('password123'),
            'is_active' => true,
        ]);

        $agencyAgent = User::create([
            'name' => 'Kamran Akmal (Agency Agent)',
            'email' => 'agent@yettoexplore.com',
            'phone' => '+92 333 4455667',
            'role' => 'agency_agent',
            'agency_id' => $northVoyagers->id,
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            'password' => Hash::make('password123'),
            'is_active' => true,
        ]);

        $tourGuide = User::create([
            'name' => 'Ali Sher (Master Guide)',
            'email' => 'guide@yettoexplore.com',
            'phone' => '+92 345 9876543',
            'role' => 'tour_guide',
            'agency_id' => $northVoyagers->id,
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            'password' => Hash::make('password123'),
            'is_active' => true,
        ]);

        $traveler = User::create([
            'name' => 'Sarah Khan',
            'email' => 'traveler@yettoexplore.com',
            'phone' => '+92 321 7654321',
            'role' => 'customer',
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            'password' => Hash::make('password123'),
            'is_active' => true,
        ]);

        $demoCustomer = User::create([
            'name' => 'Zainab Ali',
            'email' => 'demo@yettoexplore.com',
            'phone' => '+92 313 1234567',
            'role' => 'customer',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            'password' => Hash::make('password123'),
            'is_active' => true,
        ]);

        // 3. Create Destinations
        $hunza = Destination::create([
            'name' => 'Hunza Valley',
            'slug' => 'hunza-valley',
            'country' => 'Pakistan',
            'city' => 'Karimabad / Gilgit-Baltistan',
            'image' => 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
            'description' => 'A breathtaking mountainous valley renowned for rugged peaks, turquoise glacial Attabad lake, vibrant apricot blossoms, and historical forts.',
            'weather' => '18°C Sunny & Crisp',
            'best_time_to_visit' => 'April to October',
            'is_featured' => true,
        ]);

        $skardu = Destination::create([
            'name' => 'Skardu & Deosai Plains',
            'slug' => 'skardu-deosai',
            'country' => 'Pakistan',
            'city' => 'Skardu / Gilgit-Baltistan',
            'image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            'description' => 'The gateway to 4 of the worlds 14 eight-thousander peaks, featuring the celestial Shangrila resort, Katpana cold desert, and mystical Deosai.',
            'weather' => '15°C Cool Breeze',
            'best_time_to_visit' => 'June to September',
            'is_featured' => true,
        ]);

        $fairyMeadows = Destination::create([
            'name' => 'Fairy Meadows & Nanga Parbat',
            'slug' => 'fairy-meadows',
            'country' => 'Pakistan',
            'city' => 'Diamer / Gilgit-Baltistan',
            'image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
            'description' => 'A heavenly lush plateau facing the towering north face of the 8,126m Killer Mountain Nanga Parbat under million-star night skies.',
            'weather' => '12°C Alpine Chill',
            'best_time_to_visit' => 'May to October',
            'is_featured' => true,
        ]);

        $swat = Destination::create([
            'name' => 'Swat Valley & Malam Jabba',
            'slug' => 'swat-valley',
            'country' => 'Pakistan',
            'city' => 'Swat / Khyber Pakhtunkhwa',
            'image' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
            'description' => 'Known as the Switzerland of the East with lush emerald valleys, Malam Jabba ski slopes, pine-scented rivers, and Buddhist heritage.',
            'weather' => '22°C Pleasant',
            'best_time_to_visit' => 'Year-Round',
            'is_featured' => true,
        ]);

        $kumrat = Destination::create([
            'name' => 'Kumrat Valley & Katora Lake',
            'slug' => 'kumrat-valley',
            'country' => 'Pakistan',
            'city' => 'Upper Dir / KPK',
            'image' => 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
            'description' => 'Deep alpine deodar forests, roaring Panjkora river, misty cascades, and pristine high-altitude bowl-shaped Katora glacial lake.',
            'weather' => '16°C Pine Breeze',
            'best_time_to_visit' => 'May to September',
            'is_featured' => false,
        ]);

        $neelum = Destination::create([
            'name' => 'Neelum Valley & Arang Kel',
            'slug' => 'neelum-valley',
            'country' => 'Pakistan',
            'city' => 'Muzaffarabad / Azad Kashmir',
            'image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            'description' => 'A bow-shaped wonderland of verdant forests, wooden Kashmiri villages, cable car crossings to Arang Kel, and gushing streams.',
            'weather' => '20°C Mild Mountain',
            'best_time_to_visit' => 'April to November',
            'is_featured' => true,
        ]);

        // 4. Create Tours with Itineraries and Batches

        // Tour 1: Hunza Expedition
        $tour1 = Tour::create([
            'agency_id' => $northVoyagers->id,
            'destination_id' => $hunza->id,
            'title' => 'Hunza Autumn Blossom & Attabad Lake Luxury Expedition',
            'slug' => 'hunza-autumn-blossom-attabad-lake-luxury-expedition',
            'category' => 'Luxury Adventure',
            'duration_days' => 7,
            'duration_nights' => 6,
            'group_size_max' => 18,
            'difficulty' => 'Easy',
            'base_price' => 48000.00,
            'discount_price' => 42500.00,
            'cover_image' => 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
            ],
            'overview' => 'Embark on an unforgettable journey across the iconic Karakoram Highway into the majestic Hunza Valley. Experience 800-year-old Baltit and Altit Forts, jet boat across turquoise Attabad Lake, traverse the thrilling Hussaini Suspension Bridge, and watch sunset over Rakaposhi (7,788m).',
            'highlights' => [
                'Sunset view over Rakaposhi (7,788m) from Minapin & Karimabad',
                'VIP Jet boating on turquoise Attabad Lake with life jackets',
                'Guided historical tour of Altit & Baltit Forts with local historian',
                'Passu Cones Cathedral Ridge photography and Hussaini bridge walk',
                'Luxury 4-star mountain view hotel stays with 24/7 heating'
            ],
            'inclusions' => [
                'Luxury AC Coaster / Grand Cabin transportation throughout',
                '6 Nights hotel accommodation in 3/4-star verified hotels on twin-sharing',
                'Daily authentic buffet Breakfast and Chef Special Dinners',
                'Attabad Lake jet boating tickets & Fort entry permits',
                'Professional Certified Mountain Guide & Tour Manager',
                'First Aid emergency kit & oxygen cylinders'
            ],
            'exclusions' => [
                'Lunch and personal snacks',
                'Personal laundry and telephone charges',
                'Anything not mentioned in inclusions'
            ],
            'meeting_point' => 'Islamabad International Airport / I-8 Markaz Executive Lounge',
            'rating' => 4.96,
            'reviews_count' => 142,
            'is_featured' => true,
            'status' => 'active',
        ]);

        TourItinerary::create([
            'tour_id' => $tour1->id,
            'day_number' => 1,
            'title' => 'Departure from Islamabad to Chilas / Naran',
            'description' => 'Gathering at Islamabad meeting point at 4:00 AM. Scenic drive through Hazara Motorway, Babusar Pass (4,173m), and river valleys with short photography breaks.',
            'meal_plan' => 'Breakfast & Dinner',
            'hotel_name' => 'Shangrila Chilas / Rose Valley Naran',
            'activities' => ['Early departure', 'Babusar Top photo stop', 'Welcome Dinner'],
        ]);
        TourItinerary::create([
            'tour_id' => $tour1->id,
            'day_number' => 2,
            'title' => 'Chilas to Karimabad, Hunza via 3 Mountain Junction',
            'description' => 'Drive along the Indus and Gilgit rivers. Stop at the point where 3 mighty mountain ranges meet (Himalayas, Karakoram, Hindukush) and Rakaposhi viewpoint for lunch.',
            'meal_plan' => 'Breakfast & Dinner',
            'hotel_name' => 'Hunza Serena Inn / Mulberry Hotel Karimabad',
            'activities' => ['3 Mountain Junction', 'Rakaposhi View Point', 'Karimabad Traditional Market'],
        ]);
        TourItinerary::create([
            'tour_id' => $tour1->id,
            'day_number' => 3,
            'title' => 'Altit Fort, Baltit Fort & Eagle\'s Nest Sunset',
            'description' => 'Explore the centuries-old royal residence of the Mirs of Hunza. In the evening, drive up to Duikar (Eagle\'s Nest) for an awe-inspiring 360-degree panorama of Ladyfinger and Golden Peak at sunset.',
            'meal_plan' => 'Breakfast & Dinner',
            'hotel_name' => 'Hunza Serena Inn / Mulberry Hotel Karimabad',
            'activities' => ['Baltit Fort Tour', 'Altit Royal Gardens', 'Eagle\'s Nest Sunset Viewpoint'],
        ]);
        TourItinerary::create([
            'tour_id' => $tour1->id,
            'day_number' => 4,
            'title' => 'Attabad Lake Boating, Passu Cones & Hussaini Bridge',
            'description' => 'Enjoy private jet boating on the crystal turquoise water of Attabad Lake. Continue through KKH tunnels to Passu Glacier viewpoint and thrill across Hussaini suspension bridge.',
            'meal_plan' => 'Breakfast & Traditional Hunza Dinner',
            'hotel_name' => 'Passu Ambassador Hotel / Luxus Hunza',
            'activities' => ['Attabad Jet Boating', 'Passu Cones Panorama', 'Hussaini Bridge Crossing'],
        ]);
        TourItinerary::create([
            'tour_id' => $tour1->id,
            'day_number' => 5,
            'title' => 'Khunjerab Pass (Pakistan-China Border at 4,693m)',
            'description' => 'Excursion to the highest paved international border crossing in the world (World\'s Highest ATM). Spot golden marmots and Himalayan ibex in Khunjerab National Park.',
            'meal_plan' => 'Breakfast & Dinner',
            'hotel_name' => 'Hunza View Hotel Karimabad',
            'activities' => ['Khunjerab Pass Border', 'High Altitude ATM Photo', 'National Park Wildlife Sightings'],
        ]);
        TourItinerary::create([
            'tour_id' => $tour1->id,
            'day_number' => 6,
            'title' => 'Hunza to Besham / Naran with River Bonfire',
            'description' => 'Return drive along KKH with picturesque stops at Gilgit suspension bridge and local dried fruit shopping. Evening barbecue bonfire at riverside resort.',
            'meal_plan' => 'Breakfast & BBQ Dinner',
            'hotel_name' => 'Besham Continental / PTDC Motel',
            'activities' => ['Gilgit City Bazar', 'Riverside Bonfire & Musical Night'],
        ]);
        TourItinerary::create([
            'tour_id' => $tour1->id,
            'day_number' => 7,
            'title' => 'Besham to Islamabad & Farewell',
            'description' => 'Smooth drive back via Abbottabad and Hazara Expressway. Drop off at Islamabad Airport and central pick points with cherished memories.',
            'meal_plan' => 'Breakfast Only',
            'hotel_name' => 'End of Tour',
            'activities' => ['Khanpur Lake stopover', 'Drop-off Islamabad'],
        ]);

        TourBatch::create([
            'tour_id' => $tour1->id,
            'start_date' => Carbon::now()->addDays(5)->toDateString(),
            'end_date' => Carbon::now()->addDays(11)->toDateString(),
            'total_seats' => 18,
            'available_seats' => 6,
            'price_override' => 42500.00,
            'guide_name' => 'Ali Sher (Master Guide)',
            'status' => 'open',
        ]);
        TourBatch::create([
            'tour_id' => $tour1->id,
            'start_date' => Carbon::now()->addDays(15)->toDateString(),
            'end_date' => Carbon::now()->addDays(21)->toDateString(),
            'total_seats' => 18,
            'available_seats' => 14,
            'price_override' => 42500.00,
            'guide_name' => 'Hamza Tariq',
            'status' => 'open',
        ]);

        // Tour 2: Skardu & Deosai Plains
        $tour2 = Tour::create([
            'agency_id' => $karakoramExp->id,
            'destination_id' => $skardu->id,
            'title' => 'Skardu, Shangrila Resort & Deosai Plateau Odyssey',
            'slug' => 'skardu-shangrila-resort-deosai-plateau-odyssey',
            'category' => 'Mountain Expedition',
            'duration_days' => 8,
            'duration_nights' => 7,
            'group_size_max' => 16,
            'difficulty' => 'Moderate',
            'base_price' => 65000.00,
            'discount_price' => 58000.00,
            'cover_image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
            ],
            'overview' => 'Discover the legendary Land of Giants (Deosai Plains at 4,114m), heart-shaped Lower Kachura Lake, Shangrila Resort, Cold Desert Katpana sand dunes, and centuries-old Kharpocho Fort overlooking the Indus River.',
            'highlights' => [
                '4x4 Jeep Safari across Deosai Plains (Sheosar Lake & Bara Pani)',
                'Heart-shaped Shangrila Lake and aircraft pagoda photography',
                'Katpana Cold Desert sunset and bonfire under milky way stars',
                'Visit Upper Kachura Lake for trout fishing and boating',
                'Manthal Buddha Rock inscription from 8th century'
            ],
            'inclusions' => [
                'Transport in Toyota Grand Cabin & 4x4 Mountain Jeeps for Deosai',
                '7 Nights hotel stay in prime Skardu & Kachura valley resorts',
                'Breakfast and Dinner everyday with live BBQ night',
                'Deosai National Park entry tickets & lake tolls',
                'Experienced high-altitude expedition tour lead'
            ],
            'exclusions' => [
                'Personal clothing & extreme winter gear',
                'Extra jeep requests beyond itinerary'
            ],
            'meeting_point' => 'Islamabad Airport or Skardu Airport Pick-up',
            'rating' => 4.92,
            'reviews_count' => 98,
            'is_featured' => true,
            'status' => 'active',
        ]);

        TourBatch::create([
            'tour_id' => $tour2->id,
            'start_date' => Carbon::now()->addDays(8)->toDateString(),
            'end_date' => Carbon::now()->addDays(15)->toDateString(),
            'total_seats' => 16,
            'available_seats' => 4,
            'price_override' => 58000.00,
            'guide_name' => 'Ghulam Nabi (High Altitude Leader)',
            'status' => 'almost_full',
        ]);

        // Tour 3: Fairy Meadows & Nanga Parbat
        $tour3 = Tour::create([
            'agency_id' => $northVoyagers->id,
            'destination_id' => $fairyMeadows->id,
            'title' => 'Fairy Meadows & Nanga Parbat Starry Base Camp Trek',
            'slug' => 'fairy-meadows-nanga-parbat-base-camp-trek',
            'category' => 'Trekking & Camping',
            'duration_days' => 5,
            'duration_nights' => 4,
            'group_size_max' => 14,
            'difficulty' => 'Challenging',
            'base_price' => 36000.00,
            'discount_price' => 31999.00,
            'cover_image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
            ],
            'overview' => 'Ride the thrilling Raikot Bridge mountain jeep track and hike through fragrant pine forests to Fairy Meadows. Sleep in traditional wooden chalets with front-row view of the colossal 8,126m Killer Mountain Nanga Parbat.',
            'highlights' => [
                'Thrilling Raikot Bridge to Tattu village 4x4 mountain jeep track',
                'Hike through pine alpine forests to Fairy Meadows lush plateau',
                'Optional day trek to Beyal Camp (3,500m) and Nanga Parbat Base Camp',
                'Stargazing and milky-way photography at Raikot Glacier',
                'Cozy wooden cottage stays with pine wood stove heating'
            ],
            'inclusions' => [
                'Dedicated 4x4 Jeeps from Raikot Bridge to Tattu & return',
                '4 Nights wooden cottage / luxury glamping tent stay',
                'All meals (Breakfast, Lunch pack for trek, Warm Dinner)',
                'Local mountain porters & licensed mountain trekking guide'
            ],
            'exclusions' => [
                'Personal horse/mule rental if required during hike'
            ],
            'meeting_point' => 'Islamabad I-8 Markaz / Chilas',
            'rating' => 4.98,
            'reviews_count' => 210,
            'is_featured' => true,
            'status' => 'active',
        ]);

        TourBatch::create([
            'tour_id' => $tour3->id,
            'start_date' => Carbon::now()->addDays(6)->toDateString(),
            'end_date' => Carbon::now()->addDays(10)->toDateString(),
            'total_seats' => 14,
            'available_seats' => 8,
            'price_override' => 31999.00,
            'guide_name' => 'Waqas Balti',
            'status' => 'open',
        ]);

        // Tour 4: Swat Valley & Malam Jabba
        $tour4 = Tour::create([
            'agency_id' => $northVoyagers->id,
            'destination_id' => $swat->id,
            'title' => 'Swat Emerald Valley & Malam Jabba Ski Resort Getaway',
            'slug' => 'swat-emerald-valley-malam-jabba-ski-resort',
            'category' => 'Family Holiday',
            'duration_days' => 4,
            'duration_nights' => 3,
            'group_size_max' => 22,
            'difficulty' => 'Easy',
            'base_price' => 28000.00,
            'discount_price' => 24500.00,
            'cover_image' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
            ],
            'overview' => 'Experience the Switzerland of Pakistan! Enjoy chairlift rides at Malam Jabba, visit Mingora White Palace, explore Bahrain river bazaar, and relax along emerald Swat river.',
            'highlights' => [
                'Malam Jabba 800m Chairlift & Zipline adventure',
                'Historical Marghazar White Palace of the Wali of Swat',
                'Bahrain riverside trout dinner and traditional wood carvings',
                'Kalam Valley and Ushu Pine forest jeep ride'
            ],
            'inclusions' => [
                'Luxury saloon coaster transportation',
                '3 Nights hotel accommodation in Mingora & Kalam',
                'Daily breakfast and dinner with Swat trout specialty'
            ],
            'exclusions' => ['Zipline & Chairlift tickets'],
            'meeting_point' => 'Islamabad & Peshawar pick points',
            'rating' => 4.84,
            'reviews_count' => 84,
            'is_featured' => true,
            'status' => 'active',
        ]);

        TourBatch::create([
            'tour_id' => $tour4->id,
            'start_date' => Carbon::now()->addDays(3)->toDateString(),
            'end_date' => Carbon::now()->addDays(6)->toDateString(),
            'total_seats' => 22,
            'available_seats' => 12,
            'price_override' => 24500.00,
            'guide_name' => 'Usman Yousafzai',
            'status' => 'open',
        ]);

        // Tour 5: Neelum Valley Kashmir
        $tour5 = Tour::create([
            'agency_id' => $northVoyagers->id,
            'destination_id' => $neelum->id,
            'title' => 'Neelum Valley Kashmir Paradise & Arang Kel Cableway',
            'slug' => 'neelum-valley-kashmir-paradise-arang-kel',
            'category' => 'Honeymoon & Nature',
            'duration_days' => 5,
            'duration_nights' => 4,
            'group_size_max' => 20,
            'difficulty' => 'Moderate',
            'base_price' => 34000.00,
            'discount_price' => 29500.00,
            'cover_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
            ],
            'overview' => 'Journey along the turquoise Neelum River into Keran, Sharda Ancient University ruins, Kel cable car, and hike into the fairy-tale meadows of Arang Kel.',
            'highlights' => [
                'Visit Sharda Peeth historical 6th-century temple ruins',
                'Arang Kel chairlift crossing across roaring river gorge',
                'Kutton Jagran waterfall photography',
                'River-view wooden cottage stays with bonfire'
            ],
            'inclusions' => [
                'AC Transport throughout journey',
                '4 Nights hotel stay in Keran & Sharda',
                'Daily authentic breakfast & dinner'
            ],
            'exclusions' => ['Cable car charges at Kel'],
            'meeting_point' => 'Islamabad & Rawalpindi Faizabad',
            'rating' => 4.90,
            'reviews_count' => 112,
            'is_featured' => true,
            'status' => 'active',
        ]);

        TourBatch::create([
            'tour_id' => $tour5->id,
            'start_date' => Carbon::now()->addDays(7)->toDateString(),
            'end_date' => Carbon::now()->addDays(11)->toDateString(),
            'total_seats' => 20,
            'available_seats' => 9,
            'price_override' => 29500.00,
            'guide_name' => 'Mirza Adnan',
            'status' => 'open',
        ]);

        // 5. Create Promotional Coupons
        Coupon::create([
            'code' => 'EXPLORE10',
            'discount_type' => 'percentage',
            'discount_value' => 10.00,
            'min_spend' => 20000.00,
            'max_discount' => 6000.00,
            'valid_from' => Carbon::now()->subDays(10),
            'valid_to' => Carbon::now()->addMonths(3),
            'usage_limit' => 500,
            'used_count' => 42,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'SUMMER20',
            'discount_type' => 'percentage',
            'discount_value' => 20.00,
            'min_spend' => 40000.00,
            'max_discount' => 10000.00,
            'valid_from' => Carbon::now()->subDays(5),
            'valid_to' => Carbon::now()->addMonths(2),
            'usage_limit' => 200,
            'used_count' => 18,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'WELCOME5',
            'discount_type' => 'percentage',
            'discount_value' => 5.00,
            'min_spend' => 0.00,
            'max_discount' => 2500.00,
            'valid_from' => Carbon::now()->subDays(30),
            'valid_to' => Carbon::now()->addYear(),
            'usage_limit' => 1000,
            'used_count' => 88,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'VIPPASS',
            'discount_type' => 'fixed',
            'discount_value' => 5000.00,
            'min_spend' => 30000.00,
            'valid_from' => Carbon::now()->subDays(10),
            'valid_to' => Carbon::now()->addMonths(6),
            'usage_limit' => 100,
            'used_count' => 12,
            'is_active' => true,
        ]);

        // 6. Create Seed Bookings with Digital Boarding Pass
        $booking1 = Booking::create([
            'booking_number' => 'YTE-948271',
            'user_id' => $traveler->id,
            'agency_id' => $northVoyagers->id,
            'tour_id' => $tour1->id,
            'batch_id' => 1,
            'travel_date' => Carbon::now()->addDays(5)->toDateString(),
            'adults_count' => 2,
            'children_count' => 0,
            'subtotal' => 85000.00,
            'discount_amount' => 6000.00,
            'tax_amount' => 0.00,
            'total_amount' => 79000.00,
            'coupon_code' => 'EXPLORE10',
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'payment_method' => 'credit_card',
            'special_requests' => 'Twin room with direct Rakaposhi valley view please.',
            'qr_code_token' => 'YTE_PASS_7A8849F301C9',
        ]);

        BookingPassenger::create([
            'booking_id' => $booking1->id,
            'full_name' => 'Sarah Khan',
            'cnic_passport' => '61101-1234567-8',
            'gender' => 'Female',
            'age' => 28,
            'is_lead' => true,
            'phone' => '+92 321 7654321',
        ]);

        BookingPassenger::create([
            'booking_id' => $booking1->id,
            'full_name' => 'Farhan Khan',
            'cnic_passport' => '61101-9876543-1',
            'gender' => 'Male',
            'age' => 30,
            'is_lead' => false,
            'phone' => '+92 321 7654322',
        ]);

        $booking2 = Booking::create([
            'booking_number' => 'YTE-312948',
            'user_id' => $demoCustomer->id,
            'agency_id' => $karakoramExp->id,
            'tour_id' => $tour2->id,
            'batch_id' => 2,
            'travel_date' => Carbon::now()->addDays(8)->toDateString(),
            'adults_count' => 1,
            'children_count' => 0,
            'subtotal' => 58000.00,
            'discount_amount' => 5000.00,
            'tax_amount' => 0.00,
            'total_amount' => 53000.00,
            'coupon_code' => 'VIPPASS',
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'payment_method' => 'easypaisa',
            'special_requests' => 'Vegetarian meal preference.',
            'qr_code_token' => 'YTE_PASS_1B9923847DE0',
        ]);

        BookingPassenger::create([
            'booking_id' => $booking2->id,
            'full_name' => 'Zainab Ali',
            'cnic_passport' => '35201-5544332-6',
            'gender' => 'Female',
            'age' => 26,
            'is_lead' => true,
            'phone' => '+92 313 1234567',
        ]);
    }
}
