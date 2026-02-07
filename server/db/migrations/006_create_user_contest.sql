CREATE TABLE user_contest (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    contest_name VARCHAR(150) NOT NULL,
    contest_rank INT,
    rating INT,
    contest_date DATE NOT NULL,

    CONSTRAINT fk_user_contest_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
