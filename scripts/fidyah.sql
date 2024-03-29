CREATE TABLE IF NOT EXISTS user_fidyah (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_num VARCHAR(255) NOT NULL,
  total_qty VARCHAR(7) NOT NULL,
  total_qadha VARCHAR(7) NOT NULL,
  total_fidyah VARCHAR(9) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_fidyah ALTER COLUMN total_fidyah TYPE VARCHAR(15);

CREATE INDEX all_user_idx ON user_fidyah (id, name, email, phone_num);

CREATE INDEX id_name_idx ON user_fidyah (id, name);

CREATE INDEX email_idx ON user_fidyah (email);

CREATE TABLE IF NOT EXISTS rate_fidyah (
  id SERIAL PRIMARY KEY,
  rate VARCHAR(7) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rate_fidyah (id, rate) VALUES (1, 15000);

ALTER TABLE rate_fidyah ALTER COLUMN rate TYPE VARCHAR(15);