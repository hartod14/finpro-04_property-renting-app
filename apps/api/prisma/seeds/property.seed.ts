import { Prisma } from '@prisma/client';

export const propertySeed: Prisma.PropertyCreateManyInput[] = [
  {
    id: 1,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'Aryaduta Medan',
    slug: 'aryaduta-medan',
    description:
      'Located in one of the largest cities in Indonesia, Aryaduta Medan offers a strategic location close to shopping centers and popular tourist destinations. Located on Jl. Kapten Maulana Lubis No. 8, this hotel provides unparalleled premium comfort in its 195 rooms and suites. Available facilities include multipurpose meeting rooms, a 35-meter swimming pool, fitness center, appetizing culinary options, and various other amenities. Overlooking breathtaking city views, Aryaduta Medan is designed to be an art deco icon ideal for regional and international travelers on business or vacation.\n\nThe hotel has a fitness center with pool views and in-room massage services. Free Wi-Fi is available throughout the hotel. Aryaduta Medan offers spacious air-conditioned rooms with contemporary yet classy carpeted design. Each room is equipped with a flat-screen TV, safe, seating area, and tea/coffee making facilities. Bathrooms come with a shower and free toiletries. Some room types offer larger seating areas with sofas.\n\nThe Kitchen Aryaduta Medan restaurant serves Asian and Western dishes for breakfast, lunch, and dinner, while the relaxed Pool Cafe provides refreshing drinks and light snacks.\n\nThe friendly reception staff available 24 hours can assist you with concierge service and airport transfers. Business center and laundry/dry cleaning services are also available for an additional fee.\n\nYour stay at Aryaduta Medan will be even more complete when combined with visits to popular and interesting tourist attractions not far from the hotel. You can visit Lippo Plaza Medan, which is only about 400 meters away by foot. Other nearby shopping centers include Medan Mall and Sun Plaza.\n\nFor tourist destinations, you can explore religious sites such as Borobudur Temple, Shri Mariaman Temple, Mount Timur Temple, Maha Vihara Maitreya Cemara Asri, and Al-Mashun Grand Mosque. Maimun Palace, Bukit Barisan Museum, and Rahmat International Wildlife Museum Gallery are also interesting attractions you can visit not far from the hotel.\n\nStrategic location, complete facilities, and international-class service are undoubtedly reasons why you should choose Aryaduta Medan as the best place to stay in the capital of North Sumatra.',
    address:
      'Jalan Kapten Maulana Lubis No. 8, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20112',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 2,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'Adimulia Hotel Medan',
    slug: 'adimulia-hotel-medan',
    description:
      'Elegant and luxurious accommodation awaits you at Adimulia Hotel Medan. Located in the heart of Medan and only a 12-minute drive from the historic Maimun Palace in the city, this hotel offers two outdoor rooftop swimming pools, spa, and meeting/party facilities. Guests can also access free WiFi in all areas of the property.\n\nFeaturing luxurious design with carpeted or wooden floors, rooms at Adimulia Hotel Medan are air-conditioned and have large windows facing the city. Each room is also equipped with a flat-screen cable TV, seating area, and tea/coffee making facilities. En suite bathrooms come with a shower and free toiletries. Some rooms provide a larger seating area with sofas and bathtubs.\n\nEnjoy a classic European atmosphere and daily buffet breakfast at the hotel\'s Cafe de Palmo where guests can also enjoy Asian and European a la carte menus for lunch and dinner. Premium authentic Chinese cuisine is served at Jasmine Chinese Restaurant. For casual hangouts, head to the Lobby Lounge or Sports Lounge. Oval Lounge is available for guests\' private meetings.\n\nAt Adimulia Hotel Medan, guests can also find a 24-hour front desk with concierge service and luggage storage as well as free private parking on site. Kids club and indoor badminton court are available for an additional fee.\n\nMedan Train Station can be reached within a 5-minute drive while Kualanamu International Airport is about a 45-minute drive away.',
    address:
      'Jl. Pangeran Diponegoro No.8 Medan Kota, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20112',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 3,
    category_id: 1,
    tenant_id: 4,
    city_id: 1,
    name: 'Swiss-Belinn Medan',
    slug: 'swiss-belinn-medan',
    description:
      'Swiss Belinn Medan is a 3-star accommodation that features a modern minimalist concept. The rooms offered are varied and equipped with facilities, including AC, TV, and WiFi access. There are also supporting facilities, such as multipurpose rooms, restaurant, and spa services. Bolu Meranti, Maimun Palace, and Medan Grand Mosque are the closest attractions to Swiss Belinn Medan.',
    address:
      'Jl Surabaya 88, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20212',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 4,
    category_id: 1,
    tenant_id: 5,
    city_id: 1,
    name: 'favehotel S. Parman Medan',
    slug: 'favehotel-s-parman-medan',
    description:
      'favehotel S. Parman Medan is highly recommended for backpackers who want affordable yet comfortable lodging.\n\nSpa treatment is one of the main features of this hotel. Indulge yourself with soothing treatments that rejuvenate you.\n\nFrom business events to corporate meetings, favehotel S. Parman Medan provides complete services and facilities that you and your colleagues need.\n\nExcellent service combined with a wide range of facilities provided will make you not complain during your stay at favehotel S. Parman Medan.\n\nA 24-hour reception is available to serve you, from check-in to check-out, or any assistance you need. If you want more, feel free to ask the receptionist, we are always ready to accommodate you.\n\nEnjoy your favorite dishes with special cuisine from favehotel S. Parman Medan just for you.\n\nWiFi is available in public areas of the property to help you stay connected with family and friends.\n\nfavehotel S. Parman Medan is a hotel with exceptional comfort and very good service according to most hotel guests.\n\nWith all the facilities offered, favehotel S. Parman Medan is the right place to stay.',
    address:
      'Jalan Mayjend Siswondo Parman No. 313A Medan, Medan Baru, Medan, Sumatra Utara, Indonesia, 20153',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 5,
    category_id: 1,
    tenant_id: 6,
    city_id: 1,
    name: 'JW Marriott Hotel Medan',
    slug: 'jw-marriott-hotel-medan',
    description:
      'If you have the opportunity to visit Medan City, staying at JW Marriott Medan is the right choice. This 5-star accommodation is located in the heart of Medan City, close to shopping centers, city hall, culinary centers, and stations. Whether you come for tourism or business purposes, this hotel offers complete facilities and services for various needs.\n\nThis modern-style accommodation with luxurious interiors offers several room type choices. You can choose Deluxe, Executive, or Executive Deluxe room types. All rooms offer city views, even for Executive Deluxe rooms located at the end of the building. Sunrise, sunset, and city lights at night can be enjoyed from two sides.\n\nUpon arrival at the comfortable lobby of JW Marriott, you will be greeted with a friendly smile from the reception staff who work 24 hours. The porter is also ready to help carry your luggage to the hotel room. The already cool room, soft bed, equipped with a flat-screen television and cable TV programs, as well as snack options in the mini bar will surely invite you to rest and relax enjoying the room for a moment.\n\nAfter that, you can choose whether to soak in the bathtub, shower under the rainshower, or go out for activities. The choices offered by JW Marriott hotel are quite diverse, including swimming in the outdoor pool, relaxing in the infinity pool, enjoying a massage at the spa, refreshing in the sauna, or exercising at the fitness center that operates 24 hours.\n\nIf you bring children to stay at this hotel, they will surely be entertained and comfortable with the children\'s pool and play area facilities. For smaller children, there is also a childcare facility. Parents can then engage in activities more freely and relaxed.\n\nIf after relaxing or activities you feel hungry, but are too lazy to leave the hotel, you can enjoy a variety of international menus at several restaurant choices. In these restaurants, there are also vegetarian menus.\n\nFor those on a business trip, there are desk facilities and internet in the room or Wi-Fi networks in several locations to make it easier for you to connect with colleagues or send documents. There are also meeting rooms equipped with projectors that can be rented, as well as fax machines and photocopiers. If you and business colleagues want to chat casually while enjoying snacks and drinking coffee, the coffee shop at JW Marriott Medan can be an interesting choice, besides the bar and restaurant.\n\nStaying at Marriott Medan hotel which is close to main roads, you can easily find public transportation. You can easily visit shopping centers, such as Sun Plaza, Mall Medan, and Center Point. If you don\'t mind walking, there is a Merdeka Walk culinary center that can be reached in approximately 10 minutes.\n\nFor those bringing family, you can take them to Upside Down World, Junglebooked Adventure, or Wonders Water World to play. Some historical places like Maimun Palace, Al Mashun Grand Mosque, and Shri Mariamman Temple will also surely expand knowledge and deepen love for Indonesian culture. All these places are less than 5 kilometers from JW Marriott Medan hotel.\n\nThe right accommodation plays a big role in comfort while traveling. Choosing JW Marriott Medan with its strategic location and complete facilities will support a vacation atmosphere to be more practical and enjoyable.',
    address:
      'Jalan Putri Hijau No. 10, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20111',
    checkin_time: new Date('2025-04-12T15:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 6,
    category_id: 1,
    tenant_id: 7,
    city_id: 1,
    name: 'Grand City Hall Medan',
    slug: 'grand-city-hall-medan',
    description:
      'Grand City Hall Medan is an accommodation located in the center of Medan City. The accommodation is divided into several categories: hotel, suites, and apartments. The lodging is wrapped in a classic exterior design. Supporting facilities available include ballroom, meeting rooms, swimming pool, fitness center, and spa area. Grand Palladium Mall and Maimun Palace are the closest attractions to Grand City Hall Medan.',
    address:
      'Jalan Balai Kota No. 1 , Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20112',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 7,
    category_id: 1,
    tenant_id: 8,
    city_id: 1,
    name: 'Grand Mercure Medan Angkasa',
    slug: 'grand-mercure-medan-angkasa',
    description:
      'Grand Mercure Medan Angkasa is located in Medan City Center. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jl Sutomo no 1, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20235',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 8,
    category_id: 1,
    tenant_id: 8,
    city_id: 1,
    name: 'ibis Styles Medan Pattimura',
    slug: 'ibis-styles-medan-pattimura',
    description:
      'ibis Styles Medan Pattimura is located in Medan Baru. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jalan Pattimura No 442, Kelurahan Darat, Kecamatan Medan Baru, Medan Baru, Medan, Sumatra Utara, Indonesia, 20153',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 9,
    category_id: 2,
    tenant_id: 9,
    city_id: 2,
    name: 'RedDoorz Plus @ TB Simatupang',
    slug: 'reddoorz-plus-tb-simatupang',
    description:
      'RedDoorz Plus @ TB Simatupang is located in Lebak Bulus. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jalan Lebak Bulus Raya 1 No. 31 (Jalan Haji Baun ) Cilandak, Cilandak, Lebak Bulus, Jakarta, Indonesia, 12440',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 10,
    category_id: 2,
    tenant_id: 10,
    city_id: 2,
    name: 'Harlys Residence',
    slug: 'harlys-residence',
    description:
      'Harlys Residence is located in Tomang. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jalan Tomang Tinggi Raya No. 2 , Grogol Petamburan, Tomang, Jakarta, Indonesia, 11440',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 11,
    category_id: 3,
    tenant_id: 11,
    city_id: 2,
    name: 'Ascott Jakarta',
    slug: 'ascott-jakarta',
    description:
      'Ascott Jakarta is an apartment-concept accommodation located on Jalan Kebon Kacang Raya No.2. This apartment offers complete facilities, such as AC, TV, sofa chairs, and kitchen equipment. Supporting facilities available include fitness center, swimming pool, and spa services. Thamrin City and Grand Indonesia Shopping Town are the closest attractions to Ascott Jakarta.',
    address:
      'Jalan Kebon Kacang Raya No.2, Thamrin, Jakarta Pusat, Jakarta, Indonesia, 10230',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 12,
    category_id: 3,
    tenant_id: 11,
    city_id: 2,
    name: 'Citadines Sudirman Jakarta',
    slug: 'citadines-sudirman-jakarta',
    description:
      'Citadines Sudirman Jakarta is located in Newton Tower, a mixed development of serviced apartments and apartments. These serviced apartments are suitable for individuals and families. The 253 units in Citadines Sudirman Jakarta serviced apartments range from Studio, One Bedroom, family suites to Two Bedroom apartments. All apartments are equipped with modern furnishings, including smart TVs, en-suite bathrooms, split air conditioning systems, making it a comfortable home. Your privacy, security, and comfort are also guaranteed with 24-hour security and guest services. This serviced apartment\'s facilities include a fully-equipped fitness center, swimming pool, jogging track, laundry, all-day restaurant, and meeting rooms. At Citadines Sudirman Jakarta, you can always be assured of having a pleasant and relaxing stay.',
    address:
      'The Newton 1 at Ciputra World 2 Jl. Karet Sawah 219, Setiabudi, Karet Semanggi, Jakarta, Indonesia, 12930',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 13,
    category_id: 4,
    tenant_id: 12,
    city_id: 3,
    name: 'The Catur Villa Seminyak',
    slug: 'the-catur-villa-seminyak',
    description:
      'Staying at The Catur Villa Seminyak when you are in Seminyak is a smart choice. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jl. Plawa Gg. Ratna No.13 D, Seminyak, Kuta, Kabupaten Badung, Bali 80361, Seminyak, Kuta, Bali, Indonesia, 80363',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 14,
    category_id: 4,
    tenant_id: 12,
    city_id: 3,
    name: 'Aishwarya Exclusive Villas',
    slug: 'aishwarya-exclusive-villas',
    description:
      'Aishwarya Exclusive Villas is an accommodation in a good location, specifically located in Ketewel. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jl. Raya Gumicik No 26, Ketewel, Keramas, Sukawati, Ketewel, Gianyar, Bali, Indonesia, 50852',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 15,
    category_id: 4,
    tenant_id: 12,
    city_id: 3,
    name: 'Belle Astina',
    slug: 'belle-astina',
    description:
      'Belle Astina is located in Canggu. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Gang Semar 1 No.2, Canggu, Bali 80361, Canggu, Badung, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 16,
    category_id: 4,
    tenant_id: 12,
    city_id: 3,
    name: 'Buana Bali Villas \u0026 Spa',
    slug: 'buana-bali-villas-spa',
    description:
      'Buana Bali Villas \u0026 Spa is a villa in a good neighborhood, located in Jimbaran. A 24-hour reception is available to serve you, from check-in to check-out, or any assistance you need. If you want more, don\'t hesitate to ask the receptionist, we are always ready to accommodate you. WiFi is available in public areas of the property to help you stay connected with family and friends.',
    address:
      'Jalan Puri Gading Jimbaran Gading, Jimbaran, Badung, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 17,
    category_id: 4,
    tenant_id: 12,
    city_id: 3,
    name: 'Villa Kayu Raja',
    slug: 'villa-kayu-raja',
    description:
      'Villa Kayu Raja is the right choice for you who want to spend time with various luxury facilities. Enjoy the best quality service and impressive experience while staying at this accommodation.\n\nSpa service is the number one facility at this accommodation. Spend your time relaxing and pampering yourself.\n\nVilla Kayu Raja is the right place to stay for you who are on vacation with family. Enjoy all entertainment facilities for you and your family.\n\nIf you intend to stay for a long period of time, Villa Kayu Raja is the right choice. The various facilities available and good service quality will make you feel like you\'re at your own home.',
    address:
      'Jl. Lebak Sari No. 18 Petitenget, Kerobokan, Seminyak, Kuta, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 18,
    category_id: 1,
    tenant_id: 13,
    city_id: 3,
    name: 'Wyndham Garden Kuta Beach Bali',
    slug: 'wyndham-garden-kuta-beach-bali',
    description:
      'Wyndham Garden Kuta Beach Bali is a hotel in a good neighborhood, located in Kuta. A 24-hour reception is available to serve you, from check-in to check-out, or any assistance you need. If you want more, don\'t hesitate to ask the receptionist, we are always ready to accommodate you. WiFi is available in public areas of the property to help you stay connected with family and friends.',
    address: 'Jalan Pantai Kuta, No 99x, Kuta, Badung, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 19,
    category_id: 1,
    tenant_id: 14,
    city_id: 3,
    name: 'Quest Hotel Kuta by ASTON',
    slug: 'quest-hotel-kuta-by-aston',
    description:
      'Quest Hotel Kuta by ASTON is located in the Tuban area/city. A 24-hour reception is available to serve you, from check-in to check-out, or any assistance you need. If you want more, don\'t hesitate to ask the receptionist, we are always ready to accommodate you. WiFi is available in public areas of the property to help you stay connected with family and friends.',
    address:
      'Jalan Raya Kediri No. 9 , Tuban - Kuta, Bali, Tuban, Kuta, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 20,
    category_id: 1,
    tenant_id: 14,
    city_id: 3,
    name: 'Quest San Hotel Denpasar by ASTON',
    slug: 'quest-san-hotel-denpasar-by-aston',
    description:
      'For you, travelers who want to travel comfortably on a limited budget, Quest San Hotel Denpasar by ASTON is the right place to stay that provides decent facilities and excellent service.\n\nWhether you are planning an event or other special occasion, Quest San Hotel Denpasar by ASTON is the right choice for you with a spacious and complete function room to meet your needs.\n\nFrom business events to corporate meetings, Quest San Hotel Denpasar by ASTON provides complete services and facilities that you and your colleagues need.',
    address:
      'Jalan Mahendradata No.93, Denpasar Barat, Denpasar, Bali, Indonesia, 80117',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 21,
    category_id: 2,
    tenant_id: 15,
    city_id: 4,
    name: 'Sapadia Guest House Bandung',
    slug: 'sapadia-guest-house-bandung',
    description:
      'Sapadia Guest House Bandung is an accommodation in a good location, specifically located in Dago. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jalan Mundinglaya No.2 Sukasari,Cikapayang, Dago, Bandung, Jawa Barat, Indonesia, 40132',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 22,
    category_id: 2,
    tenant_id: 16,
    city_id: 4,
    name: 'Pension Guest House',
    slug: 'pension-guest-house',
    description:
      'Pension Guest House is an accommodation in a good location, specifically located on Jalan Riau. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jalan Sabang No. 42, Jalan Riau, Bandung, Jawa Barat, Indonesia, 40131',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 23,
    category_id: 4,
    tenant_id: 17,
    city_id: 4,
    name: 'Villa de Rossa',
    slug: 'villa-de-rossa',
    description:
      'Villa de Rossa is an accommodation in a good location, specifically located in Lembang. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you.',
    address:
      'Jalan  Panorama 1 No. 34-36, Lembang, Kayuambon, Lembang, Kabupaten Bandung Barat, Lembang, Bandung, Jawa Barat, Indonesia, 40391',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 24,
    category_id: 4,
    tenant_id: 18,
    city_id: 4,
    name: 'Villa Marindu And Glamping',
    slug: 'villa-marindu-and-glamping',
    description:
      'Villa Marindu And Glamping is a recommended accommodation for you, a backpacker who not only prioritizes budget but also comfort when resting after a full day of adventure.\n\nThis accommodation is the right choice for you and your partner who want to enjoy a romantic holiday. Get a memorable experience with your partner by staying at Villa Marindu And Glamping.\n\nVilla Marindu And Glamping is the right place to stay for you who are on vacation with family. Enjoy all entertainment facilities for you and your family.',
    address:
      'Jalan Sariater No. 29, Lembang, Bandung, Jawa Barat, Indonesia, 41281',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 25,
    category_id: 3,
    tenant_id: 19,
    city_id: 5,
    name: 'Green Park Jogja Apartment',
    slug: 'green-park-jogja-apartment',
    description:
      'Staying at Green Park Jogja Apartment not only provides ease to explore your adventure destinations but also offers comfort for your rest.\n\nGreen Park Jogja Apartment is a recommended accommodation for you, a backpacker who not only prioritizes budget but also comfort when resting after a full day of adventure.\n\nDesign and architecture are determining factors for your comfort in accommodation. Green Park Jogja Apartment provides a place to stay that is not only comfortable for resting but also has a beautiful design that pleases your eyes.\n\nFor those who want good quality service at a wallet-friendly price, Green Park Jogja Apartment is the right choice. Because despite being inexpensive, this accommodation provides adequate facilities and service quality that remains well-maintained.',
    address:
      'Jalan Baladewa - Babarsari, Glendongan, Tambakbayan, Caturtunggal, Depok, Depok, Yogyakarta, Daerah Istimewa Yogyakarta, Indonesia, 55281',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 26,
    category_id: 3,
    tenant_id: 20,
    city_id: 5,
    name: 'Mirta V Apartment Jogja',
    slug: 'mirta-v-apartment-jogja',
    description:
      'Mirta V Apartment Jogja is located in Seturan. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you.',
    address:
      'Jalan Amarta No.1 Kledokan, Caturtunggal, Depok, Sleman, Depok, Seturan, Yogyakarta, Indonesia, 55281',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 27,
    category_id: 1,
    tenant_id: 21,
    city_id: 5,
    name: 'Sahid Raya Hotel \u0026 Convention Yogyakarta',
    slug: 'sahid-raya-hotel-convention-yogyakarta',
    description:
      'Sahid Raya Hotel \u0026 Convention Yogyakarta is a hotel in a good location, specifically located in Depok. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jalan Babarsari, Tambakbayan, Caturtunggal Depok, Depok, Yogyakarta, Daerah Istimewa Yogyakarta, Indonesia, 55281',
    checkin_time: new Date('2025-04-12T15:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 28,
    category_id: 1,
    tenant_id: 22,
    city_id: 5,
    name: 'The Malioboro Hotel and Conference Center',
    slug: 'the-malioboro-hotel-and-conference-center',
    description:
      'Staying at The Malioboro Hotel and Conference Center when you are in Jalan Malioboro is a smart choice. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jl. Gandekan No.21, Pringgokusuman, Gedong Tengen, Jalan Malioboro, Yogyakarta, Daerah Istimewa Yogyakarta, Indonesia, 55272',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 29,
    category_id: 1,
    tenant_id: 23,
    city_id: 6,
    name: 'Platinum Hotel Tunjungan Surabaya',
    slug: 'platinum-hotel-tunjungan-surabaya',
    description:
      'Platinum Hotel Tunjungan Surabaya is a hotel in a good location, specifically located in Genteng. The reception is ready 24 hours to serve check-in, check-out processes and your other needs. Don\'t hesitate to contact the reception, we are ready to serve you. WiFi is available in all public areas of the property to help you stay connected with family and friends.',
    address:
      'Jl. Tunjungan 11 - 21 Surabaya, Genteng, Surabaya, Jawa Timur, Indonesia, 60275',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 30,
    category_id: 1,
    tenant_id: 24,
    city_id: 6,
    name: 'Four Points by Sheraton Surabaya Pakuwon Indah',
    slug: 'four-points-by-sheraton-surabaya-pakuwon-indah',
    description:
      'Four Points by Sheraton Surabaya Pakuwon Indah is an accommodation with good facilities and satisfying service quality according to most guests. Enjoy luxurious service and unforgettable experience at Four Points by Sheraton Surabaya Pakuwon Indah during your stay here.',
    address:
      'Pakuwon Mall, Jalan Puncak Indah Lontar No. 2, Wiyung, Surabaya, Jawa Timur, Indonesia, 60216',
    checkin_time: new Date('2025-04-12T15:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
];
