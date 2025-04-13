import { Prisma } from '@prisma/client';

export const propertySeed: Prisma.PropertyCreateManyInput[] = [
  {
    id: 1,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'Aryaduta Medan',
    description:
      'Terletak di salah satu kota terbesar di Indonesia, Aryaduta Medan menawarkan lokasi strategis yang dekat dengan pusat perbelanjaan dan tujuan wisata populer. Berlokasi di Jl. Kapten Maulana Lubis No. 8, hotel ini menyediakan kenyamanan premium yang tak tertandingi di 195 kamar dan suite-nya. Fasilitas yang tersedia meliputi ruang pertemuan serbaguna, kolam renang 35 meter, pusat kebugaran, pilihan kuliner yang menggugah selera, dan berbagai fasilitas lainnya. Menghadap pemandangan kota yang menakjubkan, Aryaduta Medan dirancang untuk menjadi ikon art deco yang ideal bagi pelancong regional dan internasional dalam perjalanan bisnis atau liburan.\n\nHotel ini memiliki pusat kebugaran dengan pemandangan kolam renang dan layanan pijat di kamar. Wi-Fi gratis tersedia di seluruh hotel. Aryaduta Medan menawarkan kamar ber-AC yang luas dengan desain berkarpet kontemporer namun berkelas. Setiap kamar dilengkapi dengan TV layar datar, brankas, area tempat duduk, dan fasilitas untuk membuat teh/kopi. Kamar mandi dilengkapi dengan shower dan perlengkapan mandi gratis. Beberapa tipe kamar menawarkan area tempat duduk yang lebih besar dengan sofa.\n\nRestoran The Kitchen Aryaduta Medan menyajikan hidangan Asia dan Barat untuk sarapan, makan siang, dan makan malam, sementara Pool Cafe yang santai menyediakan minuman segar dan makanan ringan.\n\nStaf resepsionis yang ramah dan tersedia 24 jam dapat membantu Anda dengan layanan concierge dan transfer bandara. Pusat bisnis dan layanan binatu/dry cleaning juga tersedia dengan biaya tambahan.\n\nPenginapan Anda di Aryaduta Medan akan semakin lengkap jika dipadukan dengan kunjungan ke tempat-tempat wisata populer dan menarik yang tidak jauh dari hotel. Anda dapat mengunjungi Lippo Plaza Medan, yang hanya berjarak sekitar 400 meter dengan berjalan kaki. Pusat perbelanjaan terdekat lainnya termasuk Medan Mall dan Sun Plaza.\n\nUntuk tujuan wisata, Anda dapat menjelajahi situs-situs keagamaan seperti Candi Borobudur, Kuil Shri Mariaman, Kuil Gunung Timur, Maha Vihara Maitreya Cemara Asri, dan Masjid Agung Al-Mashun. Istana Maimun, Museum Bukit Barisan, dan Galeri Museum Satwa Liar Internasional Rahmat juga merupakan objek wisata menarik yang dapat Anda kunjungi tidak jauh dari hotel.\n\nLokasi strategis, fasilitas lengkap, dan layanan kelas internasional tidak diragukan lagi menjadi alasan mengapa Anda harus memilih Aryaduta Medan sebagai tempat menginap terbaik di ibukota Sumatera Utara.',
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
    description:
      'Penginapan yang elegan dan mewah menanti Anda di Adimulia Hotel Medan. Terletak di jantung Medan dan hanya 12 menit berkendara dari Istana Maimun yang bersejarah di kota ini, hotel ini menawarkan dua kolam renang atap terbuka, spa, dan fasilitas pertemuan/pesta. Tamu juga dapat mengakses WiFi gratis di semua area properti.\n\nMenyajikan desain mewah dengan lantai berkarpet atau kayu, kamar di Adimulia Hotel Medan ber-AC dan memiliki jendela besar yang menghadap ke kota. Setiap kamar juga dilengkapi dengan TV kabel layar datar, area tempat duduk, dan fasilitas pembuat teh/kopi. Tersedia juga kamar mandi dalam dengan shower dan perlengkapan mandi gratis. Beberapa kamar menyediakan area tempat duduk yang lebih luas dengan sofa dan bathtub.\n\nNikmati suasana Eropa klasik dan sarapan prasmanan harian di Cafe de Palmo hotel tempat tamu juga dapat menikmati menu a la carte Asia dan Eropa untuk makan siang dan makan malam.Masakan Cina otentik premium disajikan di Jasmine Chinese Restaurant.Untuk nongkrong santai, pergilah ke Lobby Lounge atau Sports Lounge.Oval Lounge tersedia untuk pertemuan pribadi tamu.\n\nDi Adimulia Hotel Medan, tamu juga dapat menemukan meja depan 24 jam dengan layanan concierge dan penyimpanan bagasi serta parkir pribadi gratis di lokasi.Klub anak - anak dan lapangan bulu tangkis indoor tersedia dengan biaya tambahan.\n\nStasiun Kereta Api Medan dapat dicapai dalam waktu 5 menit berkendara sedangkan Bandara Internasional Kualanamu berjarak sekitar 45 menit berkendara.',
    address:
      'Jl. Pangeran Diponegoro No.8 Medan Kota, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20112',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 3,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'Swiss-Belinn Medan',
    description:
      'Swiss Belinn Medan adalah akomodasi bintang 3 yang mengusung konsep modern minimalis.Kamar yang ditawarkan beragam dan telah dilengkapi fasilitas, yakni AC, TV, hingga akses WiFi.Ada pula fasilitas pendukung, seperti ruang serbaguna, restoran, layanan spa.Bolu Meranti, Istana Maimun, dan Masjid Agung Medan adalah atraksi terdekat dari Swiss Belinn Medan.',
    address:
      'Jl Surabaya 88, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20212',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 4,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'favehotel S. Parman Medan',
    description:
      'favehotel S. Parman Medan sangat direkomendasikan untuk para backpacker yang ingin mendapatkan penginapan yang terjangkau namun nyaman.\n\nPerawatan spa adalah salah satu fitur utama hotel ini. Manjakan diri Anda dengan perawatan yang menenangkan yang meremajakan Anda.\n\nDari acara bisnis hingga pertemuan perusahaan, favehotel S. Parman Medan menyediakan layanan dan fasilitas lengkap yang Anda dan kolega Anda butuhkan.\n\nPelayanan yang luar biasa bersama dengan berbagai fasilitas yang disediakan akan membuat Anda tidak mengeluh selama menginap di favehotel S. Parman Medan.\n\nResepsionis 24 jam tersedia untuk melayani Anda, mulai dari check-in hingga check-out, atau bantuan apa pun yang Anda butuhkan. Jika Anda menginginkan lebih, jangan ragu untuk bertanya kepada resepsionis, kami selalu siap untuk mengakomodasi Anda.\n\nNikmati hidangan favorit Anda dengan masakan khusus dari favehotel S. Parman Medan khusus untuk Anda.\n\nWiFi tersedia di area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.\n\nfavehotel S. Parman Medan adalah hotel dengan kenyamanan yang luar biasa dan layanan yang sangat baik menurut sebagian besar tamu hotel.\n\nDengan semua fasilitas yang ditawarkan, favehotel S. Parman Medan adalah tempat yang tepat untuk menginap.',
    address:
      'Jalan Mayjend Siswondo Parman No. 313A Medan, Medan Baru, Medan, Sumatra Utara, Indonesia, 20153',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 5,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'JW Marriott Hotel Medan',
    description:
      'Jika Anda berkesempatan untuk berkunjung ke Kota Medan, menginap di JW Marriott Medan merupakan pilihan yang pas. Penginapan berbintang 5 ini bertempat di jantung Kota Medan, dekat dengan pusat perbelanjaan, balai kota, pusat kuliner, dan stasiun. Jika Anda datang untuk berwisata ataupun keperluan bisnis, hotel ini menawarkan fasilitas dan pelayanan lengkap untuk berbagai kebutuhan.\n\nTempat menginap bergaya modern dengan interior mewah ini menawarkan beberapa pilihan tipe kamar. Anda dapat memilih kamar tipe Deluxe, Executive, atau Executive Deluxe. Semua kamar menawarkan city view, bahkan untuk kamar bertipe Executive Deluxe yang terletak di ujung gedung. Pemandangan matahari terbit, terbenam, dan lampu-lampu kota pada malam hari dapat dinikmati dari dua sisi.\n\nSetibanya di lobi JW Marriott yang nyaman, Anda akan disambut senyuman ramah staf resepsionis yang bertugas selama 24 jam. Portir pun siap membantu membawa barang bawaan menuju kamar hotel. Kamar yang sudah sejuk, kasur empuk, dilengkapi televisi layar datar dan program TV kabel, serta pilihan kudapan di mini bar pasti mengundang untuk beristirahat dan bersantai menikmati kamar sejenak.\n\nSetelah itu, Anda dapat memilih apakah ingin berendam di bathtub, mandi di bawah rainshower, atau keluar untuk beraktivitas. Pilihan yang ditawarkan hotel JW Marriott cukup beragam, di antaranya adalah berenang di kolam renang outdoor, bersantai di kolam infinity, menikmati pijatan di spa, menyegarkan tubuh di sauna, atau berolahraga di pusat kebugaran yang beroperasi selama 24 jam.\n\nJika Anda mengajak anak-anak menginap di hotel ini, mereka pasti akan terhibur dan betah dengan adanya fasilitas kolam renang anak dan area bermain. Untuk anak-anak yang lebih kecil, tersedia pula fasilitas penitipan anak. Para orang tua pun dapat beraktivitas dengan lebih leluasa dan santai.\n\nJika setelah bersantai atau beraktivitas Anda merasa lapar, tetapi malas untuk keluar hotel, Anda dapat menikmati beraneka menu makanan mancanegara di beberapa pilihan restoran. Di restoran ini, terdapat juga menu vegetarian.\n\nBagi Anda yang sedang dalam perjalanan bisnis, ada fasilitas meja kerja dan internet dalam kamar atau jaringan Wi-Fi di beberapa lokasi untuk memudahkan Anda terhubung dengan rekan kerja atau mengirim dokumen. Tersedia pula ruang rapat yang dilengkapi dengan proyektor yang dapat disewa, serta mesin fax dan mesin fotokopi. Jika Anda dan rekan bisnis ingin berbincang santai sambil menikmati makanan ringan dan minum kopi, coffee shop di dalam JW Marriott Medan dapat menjadi pilihan menarik, selain di bar dan restoran.\n\nMenginap di hotel Marriott Medan yang dekat dengan jalan-jalan utama, Anda dapat dengan mudah mencari transportasi umum. Dengan mudah, Anda dapat mengunjungi pusat perbelanjaan, seperti Sun Plaza, Mall Medan, dan Center Point. Kalau Anda tidak keberatan berjalan kaki, ada pusat kuliner Merdeka Walk yang dapat ditempuh dalam waktu kurang lebih 10 menit.\n\nAnda yang mengajak keluarga, bisa mengajak mereka ke Upside Down World, Junglebooked Adventure, atau Wonders Water World untuk bermain. Beberapa tempat bersejarah seperti Istana Maimun, Masjid Raya al Mashun, dan Kuil Shri Mariamman juga pasti memperluas pengetahuan dan memperdalam kecintaan pada budaya Indonesia. Semua tempat tersebut berjarak kurang dari 5 kilometer dari hotel JW Marriott Medan.\n\nAkomodasi yang tepat berperan besar pada kenyamanan selagi bepergian. Memilih JW Marriott Medan dengan lokasi strategis dan fasilitas lengkap akan mendukung suasana liburan menjadi lebih praktis dan menyenangkan.',
    address:
      'Jalan Putri Hijau No. 10, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20111',
    checkin_time: new Date('2025-04-12T15:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 6,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'Grand City Hall Medan',
    description:
      'Grand City Hall Medan merupakan penginapan yang terletak di pusat Kota Medan.Akomodasi dibagi menjadi beberapa kategori, yaitu hotel, suites, serta apartemen. Penginapan dibalut dengan desain eksterior klasik.Fasilitas pendukung yang tersedia diantaranya ballroom, ruang meeting, kolam renang, pusat kebugaran, hingga area spa.Mall Grand Palladium serta Istana Maimun adalah atraksi terdekat dari Grand City Hall Medan.',
    address:
      'Jalan Balai Kota No. 1 , Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20112',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 7,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'Grand Mercure Medan Angkasa',
    description:
      'Grand Mercure Medan Angkasa berada di Pusat Kota Medan. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jl Sutomo no 1, Pusat Kota Medan, Medan, Sumatra Utara, Indonesia, 20235',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 8,
    category_id: 1,
    tenant_id: 2,
    city_id: 1,
    name: 'ibis Styles Medan Pattimura',
    description:
      'ibis Styles Medan Pattimura berada di Medan Baru. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jalan Pattimura No 442, Kelurahan Darat, Kecamatan Medan Baru, Medan Baru, Medan, Sumatra Utara, Indonesia, 20153',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 9,
    category_id: 2,
    tenant_id: 2,
    city_id: 2,
    name: 'RedDoorz Plus @ TB Simatupang',
    description:
      'RedDoorz Plus @ TB Simatupang berada di Lebak Bulus. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jalan Lebak Bulus Raya 1 No. 31 (Jalan Haji Baun ) Cilandak, Cilandak, Lebak Bulus, Jakarta, Indonesia, 12440',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 10,
    category_id: 2,
    tenant_id: 2,
    city_id: 2,
    name: 'Harlys Residence',
    description:
      'Harlys Residence berada di Tomang. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jalan Tomang Tinggi Raya No. 2 , Grogol Petamburan, Tomang, Jakarta, Indonesia, 11440',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 11,
    category_id: 3,
    tenant_id: 2,
    city_id: 2,
    name: 'Ascott Jakarta',
    description:
      'Ascott Jakarta merupakan akomodasi berkonsep apartemen yang berada di Jalan Kebon Kacang Raya No.2.Apartemen ini menawarkan fasilitas lengkap, seperti AC, TV, kursi sofa, hingga perlengkapan dapur.Fasilitas pendukung yang tersedia, yaitu pusat kebugaran, kolam renang, hingga layanan spa.Thamrin City dan Grand Indonesia Shopping Town merupakan atraksi terdekat dari Ascott Jakarta.',
    address:
      'Jalan Kebon Kacang Raya No.2, Thamrin, Jakarta Pusat, Jakarta, Indonesia, 10230',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 12,
    category_id: 3,
    tenant_id: 2,
    city_id: 2,
    name: 'Citadines Sudirman Jakarta',
    description:
      'Citadines Sudirman Jakarta terletak di dalam Newton Tower, sebuah pengembangan campuran apartemen servis dan apartemen. Apartemen servis ini cocok untuk individu maupun keluarga. 253 unit di apartemen servis Citadines Sudirman Jakarta berkisar dari Studio, Satu Kamar Tidur, suite keluarga hingga apartemen Dua Kamar Tidur. Semua apartemen dilengkapi dengan perabotan modern, termasuk televisi pintar, kamar mandi dalam, sistem penyejuk udara split, menjadikannya rumah yang nyaman. Privasi, keamanan, dan kenyamanan Anda juga terjamin dengan keamanan 24 jam dan layanan tamu. Fasilitas apartemen servis ini meliputi pusat kebugaran lengkap, kolam renang, jogging track, laundry, restoran yang buka sepanjang hari, dan ruang pertemuan. Di Citadines Sudirman Jakarta, Anda selalu dapat dipastikan memiliki masa inap yang menyenangkan dan santai',
    address:
      'The Newton 1 at Ciputra World 2 Jl. Karet Sawah 219, Setiabudi, Karet Semanggi, Jakarta, Indonesia, 12930',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 13,
    category_id: 4,
    tenant_id: 2,
    city_id: 3,
    name: 'The Catur Villa Seminyak',
    description:
      'Menginap di The Catur Villa Seminyak saat anda sedang berada di Seminyak adalah sebuah pilihan cerdas. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jl. Plawa Gg. Ratna No.13 D, Seminyak, Kuta, Kabupaten Badung, Bali 80361, Seminyak, Kuta, Bali, Indonesia, 80363',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 14,
    category_id: 4,
    tenant_id: 2,
    city_id: 3,
    name: 'Aishwarya Exclusive Villas',
    description:
      'Aishwarya Exclusive Villas adalah akomodasi di lokasi yang baik, tepatnya berada di Ketewel. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jl. Raya Gumicik No 26, Ketewel, Keramas, Sukawati, Ketewel, Gianyar, Bali, Indonesia, 50852',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 15,
    category_id: 4,
    tenant_id: 2,
    city_id: 3,
    name: 'Belle Astina',
    description:
      'Belle Astina berada di Canggu. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Gang Semar 1 No.2, Canggu, Bali 80361, Canggu, Badung, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 16,
    category_id: 4,
    tenant_id: 2,
    city_id: 3,
    name: 'Buana Bali Villas \u0026 Spa',
    description:
      'Buana Bali Villas \u0026 Spa adalah vila di lingkungan yang baik, yang terletak di Jimbaran. Resepsionis 24 jam tersedia untuk melayani Anda, mulai dari check-in hingga check-out, atau bantuan apa pun yang Anda butuhkan. Jika Anda menginginkan lebih, jangan ragu untuk bertanya kepada resepsionis, kami selalu siap untuk mengakomodasi Anda. WiFi tersedia di area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jalan Puri Gading Jimbaran Gading, Jimbaran, Badung, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 17,
    category_id: 4,
    tenant_id: 2,
    city_id: 3,
    name: 'Villa Kayu Raja',
    description:
      'Villa Kayu Raja adalah pilihan tepat bagi Anda yang ingin menghabiskan waktu dengan berbagai fasilitas mewah. Nikmati kualitas layanan terbaik dan pengalaman mengesankan selama menginap di akomodasi ini.\n\nLayanan spa adalah fasilitas nomor wahid di akomodasi ini. Habiskan waktu Anda dengan melakukan relaksasi dan memanjakan diri.\n\nVilla Kayu Raja adalah tempat bermalam yang tepat bagi Anda yang berlibur bersama keluarga. Nikmati segala fasilitas hiburan untuk Anda dan keluarga.\n\nJika Anda berniat menginap dalam jangka waktu yang lama, Villa Kayu Raja adalah pilihan tepat. Berbagai fasilitas yang tersedia dan kualitas pelayanan yang baik akan membuat Anda merasa sedang berada di rumah sendiri.',
    address:
      'Jl. Lebak Sari No. 18 Petitenget, Kerobokan, Seminyak, Kuta, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 18,
    category_id: 1,
    tenant_id: 2,
    city_id: 3,
    name: 'Wyndham Garden Kuta Beach Bali',
    description:
      'Wyndham Garden Kuta Beach Bali adalah hotel di lingkungan yang baik, yang terletak di Kuta. Resepsionis 24 jam tersedia untuk melayani Anda, mulai dari check-in hingga check-out, atau bantuan apa pun yang Anda butuhkan. Jika Anda menginginkan lebih, jangan ragu untuk bertanya kepada resepsionis, kami selalu siap untuk mengakomodasi Anda. WiFi tersedia di area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address: 'Jalan Pantai Kuta, No 99x, Kuta, Badung, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 19,
    category_id: 1,
    tenant_id: 2,
    city_id: 3,
    name: 'Quest Hotel Kuta by ASTON',
    description:
      'Quest Hotel Kuta by ASTON terletak di area / kota Tuban. Resepsionis 24 jam tersedia untuk melayani Anda, mulai dari check-in hingga check-out, atau bantuan apa pun yang Anda butuhkan. Jika Anda menginginkan lebih, jangan ragu untuk bertanya kepada resepsionis, kami selalu siap untuk mengakomodasi Anda. WiFi tersedia di area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jalan Raya Kediri No. 9 , Tuban - Kuta, Bali, Tuban, Kuta, Bali, Indonesia, 80361',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 20,
    category_id: 1,
    tenant_id: 2,
    city_id: 3,
    name: 'Quest San Hotel Denpasar by ASTON',
    description:
      'Bagi Anda, para pelancong yang ingin bepergian dengan nyaman dengan anggaran terbatas, Quest San Hotel Denpasar by ASTON adalah tempat yang tepat untuk menginap yang menyediakan fasilitas yang layak serta layanan yang luar biasa.\n\nBaik Anda merencanakan acara atau acara khusus lainnya, Quest San Hotel Denpasar by ASTON adalah pilihan yang tepat untuk Anda dengan ruang fungsi yang luas dan lengkap untuk memenuhi kebutuhan Anda.\n\nDari acara bisnis hingga pertemuan perusahaan, Quest San Hotel Denpasar by ASTON menyediakan layanan dan fasilitas lengkap yang Anda dan kolega Anda butuhkan.',
    address:
      'Jalan Mahendradata No.93, Denpasar Barat, Denpasar, Bali, Indonesia, 80117',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 21,
    category_id: 2,
    tenant_id: 2,
    city_id: 4,
    name: 'Sapadia Guest House Bandung',
    description:
      'Sapadia Guest House Bandung adalah akomodasi di lokasi yang baik, tepatnya berada di Dago. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jalan Mundinglaya No.2 Sukasari,Cikapayang, Dago, Bandung, Jawa Barat, Indonesia, 40132',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 22,
    category_id: 2,
    tenant_id: 2,
    city_id: 4,
    name: 'Pension Guest House',
    description:
      'Pension Guest House adalah akomodasi di lokasi yang baik, tepatnya berada di Jalan Riau. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jalan Sabang No. 42, Jalan Riau, Bandung, Jawa Barat, Indonesia, 40131',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 23,
    category_id: 4,
    tenant_id: 2,
    city_id: 4,
    name: 'Villa de Rossa',
    description:
      'Villa de Rossa adalah akomodasi di lokasi yang baik, tepatnya berada di Lembang. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda.',
    address:
      'Jalan  Panorama 1 No. 34-36, Lembang, Kayuambon, Lembang, Kabupaten Bandung Barat, Lembang, Bandung, Jawa Barat, Indonesia, 40391',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 24,
    category_id: 4,
    tenant_id: 2,
    city_id: 4,
    name: 'Villa Marindu And Glamping',
    description:
      'Villa Marindu And Glamping merupakan akomodasi rekomendasi untuk Anda, seorang backpacker yang tak hanya mengutamakan bujet, tapi juga kenyamanan saat beristirahat setelah menempuh petualangan seharian penuh.\n\nAkomodasi ini adalah pilihan tepat bagi Anda dan pasangan yang ingin menikmati liburan romantis. Dapatkan pengalaman yang penuh kesan bersama pasangan dengan menginap di Villa Marindu And Glamping.\n\nVilla Marindu And Glamping adalah tempat bermalam yang tepat bagi Anda yang berlibur bersama keluarga. Nikmati segala fasilitas hiburan untuk Anda dan keluarga.',
    address:
      'Jalan Sariater No. 29, Lembang, Bandung, Jawa Barat, Indonesia, 41281',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 25,
    category_id: 3,
    tenant_id: 2,
    city_id: 5,
    name: 'Green Park Jogja Apartment',
    description:
      'Menginap di Green Park Jogja Apartment tak hanya memberikan kemudahan untuk mengeksplorasi destinasi petualangan Anda, tapi juga menawarkan kenyamanan bagi istirahat Anda.\n\nGreen Park Jogja Apartment merupakan akomodasi rekomendasi untuk Anda, seorang backpacker yang tak hanya mengutamakan bujet, tapi juga kenyamanan saat beristirahat setelah menempuh petualangan seharian penuh.\n\nDesain dan arsitektur menjadi salah satu faktor penentu kenyamanan Anda di akomodasi. Green Park Jogja Apartment menyediakan tempat menginap yang tak hanya nyaman untuk beristirahat, tapi juga desain cantik yang memanjakan mata Anda.\n\nBagi Anda yang menginginkan kualitas pelayanan oke dengan harga yang ramah di kantong, Green Park Jogja Apartment adalah pilihan yang tepat. Karena meski murah, akomodasi ini menyediakan fasilitas memadai dan pelayanan yang tetap terjaga mutunya.',
    address:
      'Jalan Baladewa - Babarsari, Glendongan, Tambakbayan, Caturtunggal, Depok, Depok, Yogyakarta, Daerah Istimewa Yogyakarta, Indonesia, 55281',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 26,
    category_id: 3,
    tenant_id: 2,
    city_id: 5,
    name: 'Mirta V Apartment Jogja',
    description:
      'Mirta V Apartment Jogja berada di Seturan. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda.',
    address:
      'Jalan Amarta No.1 Kledokan, Caturtunggal, Depok, Sleman, Depok, Seturan, Yogyakarta, Indonesia, 55281',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 27,
    category_id: 1,
    tenant_id: 2,
    city_id: 5,
    name: 'Sahid Raya Hotel \u0026 Convention Yogyakarta',
    description:
      'Sahid Raya Hotel \u0026 Convention Yogyakarta adalah hotel di lokasi yang baik, tepatnya berada di Depok. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jalan Babarsari, Tambakbayan, Caturtunggal Depok, Depok, Yogyakarta, Daerah Istimewa Yogyakarta, Indonesia, 55281',
    checkin_time: new Date('2025-04-12T15:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 28,
    category_id: 1,
    tenant_id: 2,
    city_id: 5,
    name: 'The Malioboro Hotel and Conference Center',
    description:
      'Menginap di The Malioboro Hotel and Conference Center saat anda sedang berada di Jalan Malioboro adalah sebuah pilihan cerdas. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jl. Gandekan No.21, Pringgokusuman, Gedong Tengen, Jalan Malioboro, Yogyakarta, Daerah Istimewa Yogyakarta, Indonesia, 55272',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 29,
    category_id: 1,
    tenant_id: 2,
    city_id: 6,
    name: 'Platinum Hotel Tunjungan Surabaya',
    description:
      'Platinum Hotel Tunjungan Surabaya adalah hotel di lokasi yang baik, tepatnya berada di Genteng. Resepsionis siap 24 jam untuk melayani proses check-in, check-out dan kebutuhan Anda yang lain. Jangan ragu untuk menghubungi resepsionis, kami siap melayani Anda. WiFi tersedia di seluruh area publik properti untuk membantu Anda tetap terhubung dengan keluarga dan teman.',
    address:
      'Jl. Tunjungan 11 - 21 Surabaya, Genteng, Surabaya, Jawa Timur, Indonesia, 60275',
    checkin_time: new Date('2025-04-12T14:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
  {
    id: 30,
    category_id: 1,
    tenant_id: 2,
    city_id: 6,
    name: 'Four Points by Sheraton Surabaya Pakuwon Indah',
    description:
      'Four Points by Sheraton Surabaya Pakuwon Indah adalah akomodasi dengan fasilitas baik dan kualitas pelayanan memuaskan menurut sebagian besar tamu. Nikmati pelayanan mewah dan pengalaman tak terlupakan ala Four Points by Sheraton Surabaya Pakuwon Indah selama Anda menginap di sini.',
    address:
      'Pakuwon Mall, Jalan Puncak Indah Lontar No. 2, Wiyung, Surabaya, Jawa Timur, Indonesia, 60216',
    checkin_time: new Date('2025-04-12T15:00:00Z'),
    checkout_time: new Date('2025-04-12T12:00:00Z'),
  },
];
