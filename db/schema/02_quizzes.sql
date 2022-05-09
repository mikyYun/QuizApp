DROP TABLE IF EXISTS quizzes CASCADE;

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true
);
