export interface Comic {
  slug: string;
  title: string;
  cover: string;
  genres: string[];
  type: "Manhwa" | "Manga" | "Manhua";
  status: "Ongoing" | "Completed";
  rating: number;
  synopsis: string;
  author: string;
  artist: string;
  released: number;
  chapters: Chapter[];
  popular?: boolean;
  featured?: boolean;
}

export interface Chapter {
  number: number;
  title: string;
  date: string;
  pages: string[];
}

const placeholderPages = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/800/1200`
  );

export const comics: Comic[] = [
  {
    slug: "solo-leveling",
    title: "Solo Leveling",
    cover: "https://picsum.photos/seed/solo-leveling/400/600",
    genres: ["Action", "Fantasy", "Adventure"],
    type: "Manhwa",
    status: "Completed",
    rating: 9.5,
    synopsis: "Di dunia dimana pemburu berjuang melawan monster dari dungeon misterius, Sung Jin-Woo adalah pemburu terlemah. Setelah nyaris tewas dalam dungeon berbahaya, ia memperoleh kekuatan misterius yang membuatnya naik level tanpa batas.",
    author: "Chugong",
    artist: "DUBU",
    released: 2018,
    featured: true,
    popular: true,
    chapters: Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-01-01",
      pages: placeholderPages(8),
    })),
  },
  {
    slug: "tower-of-god",
    title: "Tower of God",
    cover: "https://picsum.photos/seed/tower-god/400/600",
    genres: ["Action", "Fantasy", "Mystery"],
    type: "Manhwa",
    status: "Ongoing",
    rating: 9.2,
    synopsis: "Bam telah menghabiskan seluruh hidupnya terjebak di bawah menara misterius. Ketika Rachel, satu-satunya temannya, memasuki menara, Bam memutuskan untuk mengikutinya demi menemukan alasan hidup.",
    author: "SIU",
    artist: "SIU",
    released: 2010,
    popular: true,
    chapters: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-02-01",
      pages: placeholderPages(10),
    })),
  },
  {
    slug: "the-beginning-after-the-end",
    title: "The Beginning After The End",
    cover: "https://picsum.photos/seed/tbate/400/600",
    genres: ["Action", "Fantasy", "Isekai"],
    type: "Manhwa",
    status: "Ongoing",
    rating: 9.3,
    synopsis: "Raja Arthur Leywin terlahir kembali di dunia baru yang penuh sihir. Dengan ingatan kehidupan masa lalunya, ia berjuang melindungi orang-orang yang dicintainya sambil mengungkap misteri dunia baru ini.",
    author: "TurtleMe",
    artist: "Fuyuki23",
    released: 2018,
    popular: true,
    chapters: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-03-01",
      pages: placeholderPages(9),
    })),
  },
  {
    slug: "omniscient-reader",
    title: "Omniscient Reader's Viewpoint",
    cover: "https://picsum.photos/seed/omniscient/400/600",
    genres: ["Action", "Fantasy", "Sci-Fi"],
    type: "Manhwa",
    status: "Ongoing",
    rating: 9.1,
    synopsis: "Kim Dokja adalah satu-satunya pembaca yang menyelesaikan web novel berjudul 'Three Ways to Survive the Apocalypse'. Ketika cerita itu menjadi kenyataan, ia menggunakan pengetahuannya untuk bertahan hidup.",
    author: "Sing Shong",
    artist: "Sleepy-C",
    released: 2020,
    popular: true,
    chapters: Array.from({ length: 7 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-01-15",
      pages: placeholderPages(8),
    })),
  },
  {
    slug: "nano-machine",
    title: "Nano Machine",
    cover: "https://picsum.photos/seed/nano-machine/400/600",
    genres: ["Action", "Martial Arts", "Sci-Fi"],
    type: "Manhwa",
    status: "Ongoing",
    rating: 8.8,
    synopsis: "Cheon Yeo-Woon, anak haram dari Lord Demonic Cult, menerima injeksi nanomachine dari masa depan. Dengan bantuan teknologi canggih, ia bertekad menjadi yang terkuat di dunia martial arts.",
    author: "Han-Joong-Wol-Ya",
    artist: "geum-gang-bul-gae",
    released: 2020,
    chapters: Array.from({ length: 6 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-02-10",
      pages: placeholderPages(8),
    })),
  },
  {
    slug: "return-of-mount-hua",
    title: "Return of the Mount Hua Sect",
    cover: "https://picsum.photos/seed/mount-hua/400/600",
    genres: ["Action", "Martial Arts", "Comedy"],
    type: "Manhwa",
    status: "Ongoing",
    rating: 9.0,
    synopsis: "Chung Myung, pedang terhebat dari Sekte Gunung Hua, terlahir kembali 100 tahun setelah kematiannya. Ia bertekad mengembalikan kejayaan sekte yang telah runtuh dengan caranya yang unik.",
    author: "Biga",
    artist: "LICO",
    released: 2021,
    popular: true,
    chapters: Array.from({ length: 9 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-03-05",
      pages: placeholderPages(10),
    })),
  },
  {
    slug: "one-piece",
    title: "One Piece",
    cover: "https://picsum.photos/seed/onepiece/400/600",
    genres: ["Action", "Adventure", "Comedy"],
    type: "Manga",
    status: "Ongoing",
    rating: 9.7,
    synopsis: "Monkey D. Luffy bertekad menjadi Raja Bajak Laut dengan menemukan harta karun legendaris One Piece. Bersama kru Topi Jerami, ia mengarungi Grand Line penuh bahaya dan petualangan.",
    author: "Eiichiro Oda",
    artist: "Eiichiro Oda",
    released: 1997,
    featured: true,
    popular: true,
    chapters: Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-01-20",
      pages: placeholderPages(18),
    })),
  },
  {
    slug: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    cover: "https://picsum.photos/seed/jjk/400/600",
    genres: ["Action", "Supernatural", "School"],
    type: "Manga",
    status: "Completed",
    rating: 9.0,
    synopsis: "Itadori Yuji, siswa SMA biasa, terjebak dalam dunia sihir setelah menelan jari terkutuk Raja Kutukan Ryomen Sukuna. Ia bergabung dengan Jujutsu Tech untuk melawan kutukan.",
    author: "Gege Akutami",
    artist: "Gege Akutami",
    released: 2018,
    chapters: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-02-20",
      pages: placeholderPages(16),
    })),
  },
  {
    slug: "demon-slayer",
    title: "Demon Slayer",
    cover: "https://picsum.photos/seed/demon-slayer/400/600",
    genres: ["Action", "Supernatural", "Drama"],
    type: "Manga",
    status: "Completed",
    rating: 9.1,
    synopsis: "Tanjiro Kamado menjadi pemburu iblis setelah keluarganya dibantai dan adiknya berubah menjadi iblis. Ia berjuang untuk menemukan cara mengembalikan adiknya menjadi manusia.",
    author: "Koyoharu Gotouge",
    artist: "Koyoharu Gotouge",
    released: 2016,
    chapters: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-03-10",
      pages: placeholderPages(16),
    })),
  },
  {
    slug: "martial-peak",
    title: "Martial Peak",
    cover: "https://picsum.photos/seed/martial-peak/400/600",
    genres: ["Action", "Martial Arts", "Fantasy"],
    type: "Manhua",
    status: "Ongoing",
    rating: 8.5,
    synopsis: "Yang Kai menemukan batu misterius di Puncak Bela Diri yang mengubah nasibnya. Dari murid biasa, ia memulai perjalanan menuju puncak kekuatan martial arts.",
    author: "Momo",
    artist: "Pikapi",
    released: 2019,
    chapters: Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-01-25",
      pages: placeholderPages(12),
    })),
  },
  {
    slug: "tales-of-demons-and-gods",
    title: "Tales of Demons and Gods",
    cover: "https://picsum.photos/seed/tdg/400/600",
    genres: ["Action", "Fantasy", "Martial Arts"],
    type: "Manhua",
    status: "Ongoing",
    rating: 8.6,
    synopsis: "Nie Li kembali ke masa muda setelah tewas di tangan Sage Emperor. Dengan pengetahuan masa depan, ia bertekad melindungi kota dan mengubah takdir orang-orang yang dicintainya.",
    author: "Mad Snail",
    artist: "Jiang Ruotai",
    released: 2015,
    chapters: Array.from({ length: 7 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-02-15",
      pages: placeholderPages(10),
    })),
  },
  {
    slug: "soul-land",
    title: "Soul Land",
    cover: "https://picsum.photos/seed/soul-land/400/600",
    genres: ["Action", "Fantasy", "Romance"],
    type: "Manhua",
    status: "Ongoing",
    rating: 8.7,
    synopsis: "Tang San terlahir kembali di Soul Land setelah mencuri teknik terlarang dari sekte-nya. Di dunia baru ini, setiap orang memiliki Battle Spirit dan ia memulai perjalanan menjadi yang terkuat.",
    author: "Tang Jia San Shao",
    artist: "Mu Fengchun",
    released: 2018,
    chapters: Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      date: "2024-03-15",
      pages: placeholderPages(11),
    })),
  },
];

export const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Isekai", "Martial Arts", "Mystery", "Romance", "School",
  "Sci-Fi", "Supernatural",
];

export function getComicBySlug(slug: string): Comic | undefined {
  return comics.find((c) => c.slug === slug);
}

export function getComicsByStatus(status: "Ongoing" | "Completed"): Comic[] {
  return comics.filter((c) => c.status === status);
}

export function getPopularComics(): Comic[] {
  return comics.filter((c) => c.popular);
}

export function getFeaturedComics(): Comic[] {
  return comics.filter((c) => c.featured);
}

export function searchComics(query: string): Comic[] {
  const q = query.toLowerCase();
  return comics.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.genres.some((g) => g.toLowerCase().includes(q))
  );
}
