-- Trial sign-ups collected from the 7-day email trial
CREATE TABLE IF NOT EXISTS trials (
  email        TEXT PRIMARY KEY,
  name         TEXT,
  lang         TEXT NOT NULL DEFAULT 'en',
  code         TEXT NOT NULL,
  started_at   INTEGER NOT NULL,   -- ms since epoch
  expires_at   INTEGER NOT NULL,
  token        TEXT NOT NULL,      -- unsubscribe token
  unsubscribed INTEGER NOT NULL DEFAULT 0,
  reminded_soon INTEGER NOT NULL DEFAULT 0,  -- "2 days left" sent
  reminded_end  INTEGER NOT NULL DEFAULT 0,  -- "trial ended" sent
  source       TEXT
);
CREATE INDEX IF NOT EXISTS trials_expires ON trials (expires_at);
