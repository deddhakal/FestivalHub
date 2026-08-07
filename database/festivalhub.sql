-- ============================================================
--  Festival Hub Database (Campus Events Edition)
--  festivalhub.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS festivalhub;
USE festivalhub;

-- ─── Drop tables if they exist ───────
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS admins;

-- ─── Table: admins ─────────────────────────────────────────
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Table: events ─────────────────────────────────────────
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  stage VARCHAR(100),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  category VARCHAR(50),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  image_url VARCHAR(255),
  is_free BOOLEAN DEFAULT 1,
  general_price DECIMAL(10,2) DEFAULT 0.00,
  vip_price DECIMAL(10,2) DEFAULT 0.00,
  tickets_available INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Table: bookings ───────────────────────────────────────
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  visitor_name VARCHAR(100) NOT NULL,
  visitor_email VARCHAR(150) NOT NULL,
  ticket_type ENUM('General', 'VIP') NOT NULL DEFAULT 'General',
  quantity INT NOT NULL DEFAULT 1,
  booking_ref VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ─── Table: vendors ────────────────────────────────────────
CREATE TABLE vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stall_name VARCHAR(100),
  description TEXT,
  category ENUM('Food', 'Drinks', 'Merchandise', 'Attraction') NOT NULL,
  location VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  image_url VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Table: announcements ──────────────────────────────────
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('info', 'warning', 'alert', 'success') DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Table: contact_messages ───────────────────────────────
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(150),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  SEED DATA
-- ============================================================

-- ─── Admin (password: admin123) ────────────────────────────
INSERT INTO admins (username, password_hash, name) VALUES
('admin', '$2a$10$RdozPBxyt4kkaOYzXnMX8eKeLxrLGSSQ3xNe7KKz89tWPL7qTiw.S', 'Campus Admin');

-- ─── Events ────────────────────────────────────────────────
INSERT INTO events (title, description, stage, event_date, start_time, end_time, category, latitude, longitude, image_url, is_free, general_price, vip_price, tickets_available) VALUES
('Neon Lights Music Festival', 'Experience a night of electrifying performances and spectacular light shows from top international DJs and artists.', 'Main Stage', '2026-11-05', '18:00:00', '23:30:00', 'Music', -37.7963, 144.9610, 'https://images.unsplash.com/photo-1540039155732-61ee14b12756?auto=format&fit=crop&w=800&q=80', 0, 50.00, 150.00, 1000),
('FutureTech Summit 2026', 'A gathering of the brightest minds in AI, Web3, and Robotics. Features keynote speeches and interactive panels.', 'Tech Arena', '2026-11-12', '09:00:00', '17:00:00', 'Tech', -37.7990, 144.9590, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80', 0, 100.00, 300.00, 500),
('Street Food Carnival', 'Taste diverse cuisines from around the globe at our ultimate food carnival featuring local and international vendors.', 'Central Plaza', '2026-11-20', '11:00:00', '21:00:00', 'Food', -37.7975, 144.9615, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', 1, 0.00, 0.00, 2000),
('Modern Art Exhibition', 'Discover contemporary artworks, digital art, and sculptures from rising independent and student artists.', 'Art Gallery', '2026-11-25', '10:00:00', '18:00:00', 'Art', -37.7985, 144.9630, 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80', 1, 0.00, 0.00, 300);

-- ─── Vendors ────────────────────────────────────────────────
INSERT INTO vendors (name, stall_name, description, category, location, latitude, longitude, image_url, is_active) VALUES
('Burger Masters', 'Stall B1', 'The juiciest gourmet burgers and loaded fries in town.', 'Food', 'Central Plaza Food Court', -37.7977, 144.9610, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 1),
('Liquid Magic', 'Stall D1', 'Craft cocktails, mocktails, and freshly brewed iced teas to keep you refreshed.', 'Drinks', 'Main Stage Kiosk', -37.7965, 144.9620, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', 1),
('Geek Wear', 'Stall M1', 'Exclusive tech and gaming merchandise, apparel, and limited-edition accessories.', 'Merchandise', 'Tech Arena Hall', -37.7980, 144.9600, 'https://images.unsplash.com/photo-1529336953128-a85760f58cb5?auto=format&fit=crop&w=800&q=80', 1),
('VR Rollercoaster', 'Stall A1', 'Experience the thrill of a rollercoaster in immersive virtual reality.', 'Attraction', 'Entertainment Zone', -37.7990, 144.9590, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80', 1);

-- ─── Announcements ─────────────────────────────────────────
INSERT INTO announcements (title, content, type) VALUES
('Welcome to Festival Hub!', 'Check out our new diverse range of events including music festivals, tech summits, food carnivals, and art exhibitions.', 'success'),
('Tech Summit Tickets Running Low', 'Secure your spot for the FutureTech Summit 2026 before tickets sell out completely. Grab them while they last!', 'warning');

-- ─── Sample Bookings ───────────────────────────────────────
INSERT INTO bookings (event_id, visitor_name, visitor_email, ticket_type, quantity, booking_ref) VALUES
(1, 'Alice Smith', 'alice@example.com', 'VIP', 2, 'FH-10001'),
(2, 'Bob Johnson', 'bob@example.com', 'General', 1, 'FH-10002'),
(3, 'Charlie Brown', 'charlie@example.com', 'General', 4, 'FH-10003'),
(4, 'Diana Prince', 'diana@example.com', 'General', 2, 'FH-10004');

UPDATE events SET tickets_available = tickets_available - 2 WHERE id = 1;
UPDATE events SET tickets_available = tickets_available - 1 WHERE id = 2;
UPDATE events SET tickets_available = tickets_available - 4 WHERE id = 3;
UPDATE events SET tickets_available = tickets_available - 2 WHERE id = 4;
