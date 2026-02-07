CREATE TABLE user_streak_stats (
    user_id BIGINT PRIMARY KEY,
    max_streak INT NOT NULL DEFAULT 0,
    current_streak INT NOT NULL DEFAULT 0,
    highest_solved_one_day INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_user_streak_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
