-- =============================================
-- Memory Match Game — Initial Schema
-- =============================================

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      VARCHAR(30) UNIQUE NOT NULL,
  display_name  VARCHAR(50),
  avatar_url    TEXT,
  bio           TEXT,
  country       VARCHAR(50),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Decks
CREATE TABLE public.decks (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      VARCHAR(50) UNIQUE NOT NULL,  -- 'animals', 'fruits'
  name      VARCHAR(50) NOT NULL,
  emoji     VARCHAR(10),                  -- deck icon
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Game sessions
CREATE TABLE public.game_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  deck_slug    VARCHAR(50) NOT NULL,
  difficulty   VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  moves        INT NOT NULL,
  time_seconds INT NOT NULL,
  score        INT NOT NULL,
  completed    BOOLEAN NOT NULL DEFAULT TRUE,
  seed         VARCHAR(50),
  played_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Connections between users
CREATE TABLE public.connections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status       VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (requester_id, receiver_id),
  CHECK (requester_id <> receiver_id)
);

-- Challenges between users
CREATE TABLE public.challenges (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenged_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  deck_slug             VARCHAR(50) NOT NULL,
  difficulty            VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  seed                  VARCHAR(50) NOT NULL,
  challenger_session_id UUID REFERENCES public.game_sessions(id),
  challenged_session_id UUID REFERENCES public.game_sessions(id),
  status                VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'declined')),
  winner_id             UUID REFERENCES public.profiles(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at            TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  CHECK (challenger_id <> challenged_id)
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_game_sessions_user     ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_score    ON public.game_sessions(score DESC);
CREATE INDEX idx_game_sessions_played   ON public.game_sessions(played_at DESC);
CREATE INDEX idx_connections_receiver   ON public.connections(receiver_id, status);
CREATE INDEX idx_connections_requester  ON public.connections(requester_id, status);
CREATE INDEX idx_challenges_challenged  ON public.challenges(challenged_id, status);
CREATE INDEX idx_challenges_challenger  ON public.challenges(challenger_id, status);

-- =============================================
-- Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks        ENABLE ROW LEVEL SECURITY;

-- Profiles: logged-in users can read all; only owner can update
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Game sessions: users see only their own; insert own only
CREATE POLICY "sessions_select" ON public.game_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "sessions_insert" ON public.game_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Connections: see own connections
CREATE POLICY "connections_select" ON public.connections
  FOR SELECT TO authenticated
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "connections_insert" ON public.connections
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "connections_update" ON public.connections
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id OR auth.uid() = requester_id);

-- Challenges: see own challenges
CREATE POLICY "challenges_select" ON public.challenges
  FOR SELECT TO authenticated
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

CREATE POLICY "challenges_insert" ON public.challenges
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "challenges_update" ON public.challenges
  FOR UPDATE TO authenticated
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- Decks: readable by all authenticated
CREATE POLICY "decks_select" ON public.decks
  FOR SELECT TO authenticated USING (true);

-- =============================================
-- Ranking view (public scores, no private data)
-- =============================================
CREATE VIEW public.ranking_global AS
  SELECT
    gs.id,
    gs.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    gs.score,
    gs.moves,
    gs.time_seconds,
    gs.difficulty,
    gs.deck_slug,
    gs.played_at,
    ROW_NUMBER() OVER (ORDER BY gs.score DESC, gs.time_seconds ASC) AS rank
  FROM public.game_sessions gs
  JOIN public.profiles p ON p.id = gs.user_id
  WHERE gs.completed = TRUE
  ORDER BY gs.score DESC, gs.time_seconds ASC;

-- =============================================
-- Seed initial decks
-- =============================================
INSERT INTO public.decks (slug, name, emoji) VALUES
  ('animals',   'Animales',    '🐶'),
  ('fruits',    'Frutas',      '🍎'),
  ('space',     'Espacio',     '🚀'),
  ('dinos',     'Dinosaurios', '🦕'),
  ('vehicles',  'Vehículos',   '🚗');
