import { Tour, Destination } from '../models/tour.model';
import { Booking } from '../models/booking.model';
import { User } from '../models/user.model';

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: 'Hunza Valley',
    slug: 'hunza-valley',
    country: 'Pakistan',
    city: 'Gilgit-Baltistan',
    image: 'assets/user/img/destination/dest-1.jpg',
    description: 'Ancient silk route fortress, turquoise Attabad lake, and Passu Cones.',
    is_featured: true
  },
  {
    id: 2,
    name: 'Skardu & Deosai',
    slug: 'skardu-deosai',
    country: 'Pakistan',
    city: 'Skardu',
    image: 'assets/user/img/destination/dest-2.jpg',
    description: 'Gateway to K2, mystical Shangrila resort, and world highest plateau.',
    is_featured: true
  },
  {
    id: 3,
    name: 'Swat & Kalam',
    slug: 'swat-kalam',
    country: 'Pakistan',
    city: 'Khyber Pakhtunkhwa',
    image: 'assets/user/img/destination/dest-3.jpg',
    description: 'Switzerland of the East, Mahodand Lake, and lush pine forests.',
    is_featured: true
  },
  {
    id: 4,
    name: 'Bali Tropical Escape',
    slug: 'bali-indonesia',
    country: 'Indonesia',
    city: 'Ubud',
    image: 'assets/user/img/destination/dest-4.jpg',
    description: 'Pristine beaches, emerald rice terraces, and sacred sea temples.',
    is_featured: true
  },
  {
    id: 5,
    name: 'Dubai Luxury Safari',
    slug: 'dubai-uae',
    country: 'United Arab Emirates',
    city: 'Dubai',
    image: 'assets/user/img/destination/dest-5.jpg',
    description: 'Futuristic skylines, desert dune bashing, and luxury marina yachting.',
    is_featured: true
  }
];

export const MOCK_TOURS: Tour[] = [
  {
    id: 1,
    agency_id: 1,
    destination_id: 1,
    title: 'Majestic Hunza & Attabad Lake Expedition',
    slug: 'majestic-hunza-attabad-lake-expedition',
    tagline: '7 Days of breathtaking peaks, turquoise lakes & royal fortresses',
    overview: 'Experience the crown jewel of Northern Pakistan. Traverse the legendary Karakoram Highway, cruise the surreal turquoise waters of Attabad Lake, explore 900-year-old Altit and Baltit Forts, and watch the golden sunset over Passu Cathedral Cones.',
    cover_image: 'assets/user/img/tour/tour-1.jpg',
    gallery_images: [
      'assets/user/img/tour/tour-1.jpg',
      'assets/user/img/tour/tour-2.jpg',
      'assets/user/img/tour/tour-3.jpg',
      'assets/user/img/tour/tour-4.jpg'
    ],
    duration_days: 7,
    duration_nights: 6,
    base_price: 380,
    discount_price: 340,
    child_price: 220,
    infant_price: 0,
    max_group_size: 18,
    difficulty_level: 'easy',
    inclusions: [
      'Luxury AC Coaster / Prado Transport with professional driver',
      '6 Nights accommodation in standard 4-star hotels on twin/triple sharing',
      'Daily Buffet Breakfast & Traditional Dinner',
      'Attabad Lake Boat Safari entry pass',
      'Licensed English/Urdu speaking Tour Guide',
      'All toll taxes, fuel, and highway permits'
    ],
    exclusions: [
      'Air tickets to/from departure hub',
      'Lunch and personal snacks / beverage expenses',
      'Personal travel insurance',
      'Tips for tour guides and hotel staff'
    ],
    meeting_point: 'Islamabad International Airport / I-8 Markaz Terminal',
    is_featured: true,
    status: 'published',
    rating: 4.9,
    reviews_count: 128,
    agency: {
      id: 1,
      user_id: 10,
      company_name: 'Karakoram Nomads Travel & Tours',
      slug: 'karakoram-nomads',
      tagline: 'Premier Expedition Partner of Northern Pakistan',
      email: 'contact@karakoramnomads.com',
      phone: '+92 300 8594211',
      is_verified: true,
      commission_rate: 8.0,
      rating: 4.9,
      total_reviews: 340,
      total_tours: 14,
      created_at: '2026-01-10'
    },
    itineraries: [
      {
        id: 101,
        tour_id: 1,
        day_number: 1,
        title: 'Islamabad to Naran / Chilas via Hazara Motorway',
        description: 'Departure early morning from Islamabad. Scenic drive through Abbottabad, Manshera, and lush green valleys of Hazara. Overnight stay at Chilas / Naran.',
        meal_plan: 'Dinner Included',
        hotel_name: 'Shangrila Indus View Hotel'
      },
      {
        id: 102,
        tour_id: 1,
        day_number: 2,
        title: '3 Mountain Ranges Junction & Arrival in Karimabad',
        description: 'Stop at the world-famous junction point of Himalayas, Karakoram, and Hindu Kush. Continue along the roaring Hunza river to Karimabad.',
        meal_plan: 'Breakfast & Dinner',
        hotel_name: 'Hunza Serena Inn / Darbar Hotel'
      },
      {
        id: 103,
        tour_id: 1,
        day_number: 3,
        title: 'Altit Fort, Baltit Fort & Karimabad Heritage Bazaar',
        description: 'Guided tour of historical forts dating back 900+ years. Evening walk in Karimabad bazaar tasting fresh apricot juice and local walnut cake.',
        meal_plan: 'Breakfast & Dinner',
        hotel_name: 'Hunza Serena Inn'
      },
      {
        id: 104,
        tour_id: 1,
        day_number: 4,
        title: 'Attabad Lake Boating, Hussaini Suspension Bridge & Passu Cones',
        description: 'Jet boat tour across deep blue Attabad Lake. Walk across thrilling Hussaini suspension bridge and photography at Passu Glacier viewpoint.',
        meal_plan: 'Breakfast & Dinner',
        hotel_name: 'Passu Ambassador Lodge'
      },
      {
        id: 105,
        tour_id: 1,
        day_number: 5,
        title: 'Khunjerab Pass (Pak-China Border) Expedition',
        description: 'Drive to the highest paved international border crossing in the world (4,693m). View Himalayan ibex, snow-capped peaks, and high altitude flora.',
        meal_plan: 'Breakfast & Dinner',
        hotel_name: 'Hunza Darbar Hotel'
      },
      {
        id: 106,
        tour_id: 1,
        day_number: 6,
        title: 'Return Journey to Besham / Naran Valley',
        description: 'Scenic descent through the Karakoram canyons with brief cultural and photography stops.',
        meal_plan: 'Breakfast & Dinner',
        hotel_name: 'Besham Continental Hotel'
      },
      {
        id: 107,
        tour_id: 1,
        day_number: 7,
        title: 'Arrival in Islamabad & Farewell Dinner',
        description: 'Smooth highway drive back to Islamabad. Drop-off at designated pickup points with unforgettable memories.',
        meal_plan: 'Breakfast Included',
        hotel_name: 'Departure Day'
      }
    ],
    batches: [
      {
        id: 201,
        tour_id: 1,
        start_date: '2026-10-15',
        end_date: '2026-10-21',
        total_seats: 20,
        available_seats: 7,
        status: 'filling_fast'
      },
      {
        id: 202,
        tour_id: 1,
        start_date: '2026-10-25',
        end_date: '2026-10-31',
        total_seats: 20,
        available_seats: 14,
        status: 'open'
      },
      {
        id: 203,
        tour_id: 1,
        start_date: '2026-11-05',
        end_date: '2026-11-11',
        total_seats: 20,
        available_seats: 19,
        status: 'open'
      }
    ],
    created_at: '2026-08-01'
  },
  {
    id: 2,
    agency_id: 1,
    destination_id: 2,
    title: 'Skardu, Shangrila & Deosai Plains Safari',
    slug: 'skardu-shangrila-deosai-plains-safari',
    tagline: '6 Days into the land of giants, cold desert & crystal alpine lakes',
    overview: 'Explore the gateway to the mighty Karakoram giants. Visit Lower & Upper Kachura Lake, experience luxury at Shangrila, cross the Sarfaranga Cold Desert, and venture onto the world second highest plateau: Deosai.',
    cover_image: 'assets/user/img/tour/tour-2.jpg',
    gallery_images: [
      'assets/user/img/tour/tour-2.jpg',
      'assets/user/img/tour/tour-3.jpg',
      'assets/user/img/tour/tour-1.jpg'
    ],
    duration_days: 6,
    duration_nights: 5,
    base_price: 420,
    discount_price: 375,
    child_price: 240,
    infant_price: 0,
    max_group_size: 15,
    difficulty_level: 'moderate',
    inclusions: [
      '4x4 Dedicated Mountain Jeeps & AC Coasters',
      '5 Nights Deluxe Hotel & Glamping stays',
      'Breakfast and Dinner Daily',
      'Deosai National Park entry & 4x4 Jeep fee',
      'Expert Mountain Guide & First Aid support'
    ],
    exclusions: ['Airfare', 'Lunch', 'Personal gear & sleeping bags'],
    meeting_point: 'Islamabad / Skardu Airport',
    is_featured: true,
    status: 'published',
    rating: 4.85,
    reviews_count: 94,
    itineraries: [
      {
        id: 201,
        tour_id: 2,
        day_number: 1,
        title: 'Arrival in Skardu & Kachura Lakes',
        description: 'Explore Upper Kachura Lake and Shangrila Resort gardens.',
        meal_plan: 'Dinner Included',
        hotel_name: 'Shangrila Resort Skardu'
      },
      {
        id: 202,
        tour_id: 2,
        day_number: 2,
        title: 'Sarfaranga Cold Desert & Shigar Valley Fort',
        description: 'Visit the unique high altitude cold desert with sand dunes and Shigar Palace.',
        meal_plan: 'Breakfast & Dinner',
        hotel_name: 'Serena Shigar Fort'
      },
      {
        id: 203,
        tour_id: 2,
        day_number: 3,
        title: 'Deosai National Park & Sheosar Lake Safari',
        description: 'Full day 4x4 Jeep safari into Deosai National Park, home of Himalayan Brown Bears and crystal blue Sheosar Lake.',
        meal_plan: 'Breakfast & Dinner',
        hotel_name: 'Skardu Continental'
      }
    ],
    batches: [
      {
        id: 301,
        tour_id: 2,
        start_date: '2026-10-18',
        end_date: '2026-10-23',
        total_seats: 15,
        available_seats: 4,
        status: 'filling_fast'
      },
      {
        id: 302,
        tour_id: 2,
        start_date: '2026-11-01',
        end_date: '2026-11-06',
        total_seats: 15,
        available_seats: 12,
        status: 'open'
      }
    ],
    created_at: '2026-08-05'
  },
  {
    id: 3,
    agency_id: 2,
    destination_id: 4,
    title: 'Bali Exotic Beaches, Temples & Ubud Waterfall Tour',
    slug: 'bali-exotic-beaches-temples-ubud-waterfall-tour',
    tagline: '5 Days of tropical paradise, volcano views, and sacred sanctuary',
    overview: 'Unwind in idyllic Bali with private guided transfers, Uluwatu sunset temple cliff view, Ubud monkey forest, Tegalalang rice terraces, and romantic beach dinners.',
    cover_image: 'assets/user/img/tour/tour-3.jpg',
    gallery_images: [
      'assets/user/img/tour/tour-3.jpg',
      'assets/user/img/tour/tour-4.jpg'
    ],
    duration_days: 5,
    duration_nights: 4,
    base_price: 520,
    discount_price: 460,
    child_price: 310,
    infant_price: 50,
    max_group_size: 12,
    difficulty_level: 'easy',
    inclusions: [
      'Private air-conditioned SUV with English speaking driver',
      '4 Nights 5-Star Luxury Resort with private pool villa option',
      'Daily international buffet breakfast',
      'All temple entry tickets and sarongs',
      'Ubud jungle swing ticket included'
    ],
    exclusions: ['International Flights', 'Visa on Arrival fee', 'Personal expenses'],
    meeting_point: 'Ngurah Rai International Airport (DPS), Bali',
    is_featured: true,
    status: 'published',
    rating: 4.95,
    reviews_count: 210,
    batches: [
      {
        id: 401,
        tour_id: 3,
        start_date: '2026-10-20',
        end_date: '2026-10-24',
        total_seats: 12,
        available_seats: 6,
        status: 'open'
      }
    ],
    created_at: '2026-08-10'
  }
];

export const MOCK_USER: User = {
  id: 1,
  name: 'Hamza Khan',
  email: 'traveler@yettoexplore.com',
  phone: '+92 300 9876543',
  avatar: 'assets/user/img/team/team-1.jpg',
  role: 'customer',
  created_at: '2026-09-01',
  updated_at: '2026-09-10'
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    booking_number: 'YTE-2026-8942',
    user_id: 1,
    tour_id: 1,
    agency_id: 1,
    batch_id: 201,
    travel_date: '2026-10-15',
    adults_count: 2,
    children_count: 0,
    infants_count: 0,
    total_passengers: 2,
    subtotal: 680,
    discount_amount: 50,
    coupon_code: 'EXPLORE50',
    total_amount: 630,
    paid_amount: 630,
    due_amount: 0,
    status: 'confirmed',
    payment_status: 'succeeded',
    payment_method: 'Credit Card (Stripe)',
    qr_code_token: 'QR_YTE_8942_HUNZA_SECURE_HASH',
    passengers: [
      { full_name: 'Hamza Khan', cnic_passport: '42101-9876543-1', age: 28, gender: 'male', is_lead: true, phone: '+92 300 9876543' },
      { full_name: 'Ayesha Hamza', cnic_passport: '42101-9876543-2', age: 26, gender: 'female', is_lead: false }
    ],
    tour: MOCK_TOURS[0],
    created_at: '2026-09-05'
  }
];
