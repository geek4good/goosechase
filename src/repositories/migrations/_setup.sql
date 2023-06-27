CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS games ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name text NOT NULL, description text NOT NULL);
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mission_category') THEN CREATE TYPE mission_category AS ENUM ('text', 'photo+video', 'gps'); END IF; END $$;
CREATE TABLE IF NOT EXISTS missions ( id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), name text NOT NULL, description text NOT NULL, points integer NOT NULL, category mission_category NOT NULL, game_id uuid REFERENCES games (id) NOT NULL);
CREATE INDEX IF NOT EXISTS missions_game_id_idx ON missions(game_id);