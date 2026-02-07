CREATE TABLE user_heatmap (
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    count_of_solved INT NOT NULL,

    CONSTRAINT pk_user_heatmap
        PRIMARY KEY (user_id, date),

    CONSTRAINT fk_user_heatmap_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
