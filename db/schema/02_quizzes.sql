DROP TABLE IF EXISTS quizzes CASCADE;

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  random_string VARCHAR(255) DEFAULT NULL
);



quizzes
-- id | user_id | question | answer | is_public  | random_string
-- 1    2(mike)    mikeQ      mikeA    false        a1b2c3
-- 1    3(moon)    q1        a1    false            x1y2z3
-- 1    3(moon)    q1        a1   false            x1y2z3

