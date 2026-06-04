INSERT INTO users (name, email, password_hash, is_active, is_verified)
VALUES
    (
        'Test User',
        'test@example.com',
        '$2b$10$rJMBCFDKLnSqWNHmJpFxpO5PqCiEpqNtJwGEY7pElRVnJxqMqKmGy',
        TRUE,
        TRUE
    ),
    (
        'John Doe',
        'john@example.com',
        '$2b$10$rJMBCFDKLnSqWNHmJpFxpO5PqCiEpqNtJwGEY7pElRVnJxqMqKmGy',
        TRUE,
        TRUE
    );