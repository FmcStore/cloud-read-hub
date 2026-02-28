
-- Create comics table
CREATE TABLE public.comics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  cover text NOT NULL DEFAULT '',
  genres text[] NOT NULL DEFAULT '{}',
  type text NOT NULL DEFAULT 'Manhwa' CHECK (type IN ('Manhwa', 'Manga', 'Manhua')),
  status text NOT NULL DEFAULT 'Ongoing' CHECK (status IN ('Ongoing', 'Completed')),
  rating numeric(3,1) NOT NULL DEFAULT 0,
  synopsis text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT '',
  artist text NOT NULL DEFAULT '',
  released integer NOT NULL DEFAULT 2024,
  popular boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comic_id uuid NOT NULL REFERENCES public.comics(id) ON DELETE CASCADE,
  number integer NOT NULL,
  title text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  pages text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(comic_id, number)
);

-- Enable RLS
ALTER TABLE public.comics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Anyone can read comics and chapters
CREATE POLICY "Anyone can view comics" ON public.comics FOR SELECT USING (true);
CREATE POLICY "Anyone can view chapters" ON public.chapters FOR SELECT USING (true);

-- Only admins can modify comics
CREATE POLICY "Admins can insert comics" ON public.comics FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update comics" ON public.comics FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete comics" ON public.comics FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can modify chapters
CREATE POLICY "Admins can insert chapters" ON public.chapters FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update chapters" ON public.chapters FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete chapters" ON public.chapters FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_comics_updated_at BEFORE UPDATE ON public.comics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed comics from static data
INSERT INTO public.comics (slug, title, cover, genres, type, status, rating, synopsis, author, artist, released, popular, featured) VALUES
('solo-leveling', 'Solo Leveling', 'https://picsum.photos/seed/solo-leveling/400/600', ARRAY['Action','Fantasy','Adventure'], 'Manhwa', 'Completed', 9.5, 'Di dunia dimana pemburu berjuang melawan monster dari dungeon misterius, Sung Jin-Woo adalah pemburu terlemah. Setelah nyaris tewas dalam dungeon berbahaya, ia memperoleh kekuatan misterius yang membuatnya naik level tanpa batas.', 'Chugong', 'DUBU', 2018, true, true),
('tower-of-god', 'Tower of God', 'https://picsum.photos/seed/tower-god/400/600', ARRAY['Action','Fantasy','Mystery'], 'Manhwa', 'Ongoing', 9.2, 'Bam telah menghabiskan seluruh hidupnya terjebak di bawah menara misterius. Ketika Rachel, satu-satunya temannya, memasuki menara, Bam memutuskan untuk mengikutinya demi menemukan alasan hidup.', 'SIU', 'SIU', 2010, true, false),
('the-beginning-after-the-end', 'The Beginning After The End', 'https://picsum.photos/seed/tbate/400/600', ARRAY['Action','Fantasy','Isekai'], 'Manhwa', 'Ongoing', 9.3, 'Raja Arthur Leywin terlahir kembali di dunia baru yang penuh sihir. Dengan ingatan kehidupan masa lalunya, ia berjuang melindungi orang-orang yang dicintainya sambil mengungkap misteri dunia baru ini.', 'TurtleMe', 'Fuyuki23', 2018, true, false),
('omniscient-reader', 'Omniscient Reader''s Viewpoint', 'https://picsum.photos/seed/omniscient/400/600', ARRAY['Action','Fantasy','Sci-Fi'], 'Manhwa', 'Ongoing', 9.1, 'Kim Dokja adalah satu-satunya pembaca yang menyelesaikan web novel berjudul Three Ways to Survive the Apocalypse. Ketika cerita itu menjadi kenyataan, ia menggunakan pengetahuannya untuk bertahan hidup.', 'Sing Shong', 'Sleepy-C', 2020, true, false),
('nano-machine', 'Nano Machine', 'https://picsum.photos/seed/nano-machine/400/600', ARRAY['Action','Martial Arts','Sci-Fi'], 'Manhwa', 'Ongoing', 8.8, 'Cheon Yeo-Woon, anak haram dari Lord Demonic Cult, menerima injeksi nanomachine dari masa depan. Dengan bantuan teknologi canggih, ia bertekad menjadi yang terkuat di dunia martial arts.', 'Han-Joong-Wol-Ya', 'geum-gang-bul-gae', 2020, false, false),
('return-of-mount-hua', 'Return of the Mount Hua Sect', 'https://picsum.photos/seed/mount-hua/400/600', ARRAY['Action','Martial Arts','Comedy'], 'Manhwa', 'Ongoing', 9.0, 'Chung Myung, pedang terhebat dari Sekte Gunung Hua, terlahir kembali 100 tahun setelah kematiannya. Ia bertekad mengembalikan kejayaan sekte yang telah runtuh dengan caranya yang unik.', 'Biga', 'LICO', 2021, true, false),
('one-piece', 'One Piece', 'https://picsum.photos/seed/onepiece/400/600', ARRAY['Action','Adventure','Comedy'], 'Manga', 'Ongoing', 9.7, 'Monkey D. Luffy bertekad menjadi Raja Bajak Laut dengan menemukan harta karun legendaris One Piece. Bersama kru Topi Jerami, ia mengarungi Grand Line penuh bahaya dan petualangan.', 'Eiichiro Oda', 'Eiichiro Oda', 1997, true, true),
('jujutsu-kaisen', 'Jujutsu Kaisen', 'https://picsum.photos/seed/jjk/400/600', ARRAY['Action','Supernatural','School'], 'Manga', 'Completed', 9.0, 'Itadori Yuji, siswa SMA biasa, terjebak dalam dunia sihir setelah menelan jari terkutuk Raja Kutukan Ryomen Sukuna. Ia bergabung dengan Jujutsu Tech untuk melawan kutukan.', 'Gege Akutami', 'Gege Akutami', 2018, false, false),
('demon-slayer', 'Demon Slayer', 'https://picsum.photos/seed/demon-slayer/400/600', ARRAY['Action','Supernatural','Drama'], 'Manga', 'Completed', 9.1, 'Tanjiro Kamado menjadi pemburu iblis setelah keluarganya dibantai dan adiknya berubah menjadi iblis. Ia berjuang untuk menemukan cara mengembalikan adiknya menjadi manusia.', 'Koyoharu Gotouge', 'Koyoharu Gotouge', 2016, false, false),
('martial-peak', 'Martial Peak', 'https://picsum.photos/seed/martial-peak/400/600', ARRAY['Action','Martial Arts','Fantasy'], 'Manhua', 'Ongoing', 8.5, 'Yang Kai menemukan batu misterius di Puncak Bela Diri yang mengubah nasibnya. Dari murid biasa, ia memulai perjalanan menuju puncak kekuatan martial arts.', 'Momo', 'Pikapi', 2019, false, false),
('tales-of-demons-and-gods', 'Tales of Demons and Gods', 'https://picsum.photos/seed/tdg/400/600', ARRAY['Action','Fantasy','Martial Arts'], 'Manhua', 'Ongoing', 8.6, 'Nie Li kembali ke masa muda setelah tewas di tangan Sage Emperor. Dengan pengetahuan masa depan, ia bertekad melindungi kota dan mengubah takdir orang-orang yang dicintainya.', 'Mad Snail', 'Jiang Ruotai', 2015, false, false),
('soul-land', 'Soul Land', 'https://picsum.photos/seed/soul-land/400/600', ARRAY['Action','Fantasy','Romance'], 'Manhua', 'Ongoing', 8.7, 'Tang San terlahir kembali di Soul Land setelah mencuri teknik terlarang dari sekte-nya. Di dunia baru ini, setiap orang memiliki Battle Spirit dan ia memulai perjalanan menjadi yang terkuat.', 'Tang Jia San Shao', 'Mu Fengchun', 2018, false, false);

-- Seed chapters for each comic
DO $$
DECLARE
  comic_record RECORD;
  i INTEGER;
  page_count INTEGER;
BEGIN
  FOR comic_record IN SELECT id, slug FROM public.comics LOOP
    -- Determine page count based on type
    page_count := 8;
    
    FOR i IN 1..8 LOOP
      INSERT INTO public.chapters (comic_id, number, title, date, pages)
      VALUES (
        comic_record.id,
        i,
        'Chapter ' || i,
        '2024-01-01',
        ARRAY(SELECT 'https://picsum.photos/seed/' || comic_record.slug || '-ch' || i || '-p' || g || '/800/1200' FROM generate_series(1, page_count) AS g)
      );
    END LOOP;
  END LOOP;
END $$;
