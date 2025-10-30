-- Insert test users (password is 'admin123' and 'user123' hashed with bcrypt)
-- You can generate bcrypt hashes at: https://bcrypt-generator.com/
INSERT INTO users (username, password, role) VALUES
  ('admin', '$2a$10$rOzJQjYgVELKZXQvZxGxPeYvXxXxXxXxXxXxXxXxXxXxXxXxXxX', 'ADMIN'),
  ('testuser', '$2a$10$rOzJQjYgVELKZXQvZxGxPeYvXxXxXxXxXxXxXxXxXxXxXxXxXxX', 'USER')
ON CONFLICT (username) DO NOTHING;

-- Note: Replace the password hashes above with actual bcrypt hashes
-- admin123 hash: $2a$10$rOzJQjYgVELKZXQvZxGxPeYvXxXxXxXxXxXxXxXxXxXxXxXxXxX
-- user123 hash: $2a$10$rOzJQjYgVELKZXQvZxGxPeYvXxXxXxXxXxXxXxXxXxXxXxXxXxX
