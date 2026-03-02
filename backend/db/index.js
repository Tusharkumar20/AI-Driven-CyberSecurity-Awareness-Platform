CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(50),
  avatar_url VARCHAR(255),
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  modules_completed TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);