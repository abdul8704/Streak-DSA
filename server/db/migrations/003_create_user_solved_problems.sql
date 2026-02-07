CREATE TABLE user_solved_problems (
    user_id BIGINT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    problem_id VARCHAR(100) NOT NULL,
    solved_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_user_solved_problems
        PRIMARY KEY (user_id, platform, problem_id),

    CONSTRAINT fk_user_solved_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
