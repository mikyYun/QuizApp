DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  -- user_id REFERENCES users(id),
  quiz TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_public BOOLEAN NOT NULL
);

INSERT INTO quizzes (creator)
VALUES (userid = primary key)
user id = 1 -> program creator
