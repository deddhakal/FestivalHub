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
INSERT INTO events (title, description, stage, event_date, start_time, end_time, category, latitude, longitude, tickets_available) VALUES
('Spring Music Festival', 'The biggest outdoor music event of the semester featuring student bands and a headline DJ.', 'Main Quad', '2026-09-10', '16:00:00', '22:00:00', 'Music', -37.7963, 144.9610, 800),
('Global Hackathon 2026', 'A 24-hour coding marathon to solve real-world problems. Free food and amazing prizes!', 'Innovation Center', '2026-09-15', '09:00:00', '09:00:00', 'Hackathon', -37.7990, 144.9590, 150),
('Student Art Exhibition', 'Explore breathtaking artwork, photography, and sculptures created by our fine arts students.', 'Creative Arts Building', '2026-09-18', '11:00:00', '18:00:00', 'Art', -37.7985, 144.9630, 300),
('International Food Fiesta', 'Taste the world! Stalls featuring authentic cuisines prepared by international student clubs.', 'Student Union Plaza', '2026-09-22', '12:00:00', '16:00:00', 'Food', -37.7975, 144.9615, 500),
('Campus Marathon & Sports Day', 'Join the 5K run around the campus followed by inter-college sports tournaments.', 'Athletics Track', '2026-09-25', '08:00:00', '15:00:00', 'Sports', -37.8000, 144.9640, 250),
('Diwali Cultural Night', 'Celebrate the festival of lights with traditional dances, music, and a grand feast.', 'Main Auditorium', '2026-10-15', '18:00:00', '23:00:00', 'Cultural', -37.7963, 144.9610, 600),
('AI & Future Tech Workshop', 'Hands-on workshop exploring the latest in generative AI and machine learning trends.', 'Tech Hub Room 201', '2026-10-20', '14:00:00', '17:00:00', 'Workshop', -37.7990, 144.9590, 80),
('Indie Film Screening', 'A cozy movie night under the stars screening award-winning indie films.', 'Lawn Amphitheater', '2026-10-28', '19:30:00', '22:30:00', 'Film Club', -37.7995, 144.9605, 200);

-- ─── Vendors ────────────────────────────────────────────────
INSERT INTO vendors (name, stall_name, description, category, location, latitude, longitude, is_active) VALUES
('The Matcha Bar', 'Stall A1', 'Premium iced matcha lattes, boba, and Asian-inspired pastries.', 'Drinks', 'Union Square Kiosk', -37.7975, 144.9615, 1),
('Gourmet Grilled Cheese', 'Stall B2', 'Artisan grilled cheese sandwiches with locally sourced sourdough.', 'Food', 'Main Quad Food Trucks', -37.7977, 144.9610, 1),
('Campus Thrift & Vintage', 'Stall C3', 'Student-run thrift shop featuring vintage clothing and accessories.', 'Merchandise', 'Student Hub - Level 1', -37.7980, 144.9600, 1),
('VR Gaming Experience', 'Stall D4', 'Step into another world with our immersive VR setups. Free for students!', 'Attraction', 'Innovation Center', -37.7990, 144.9590, 1),
('Acai & Smoothie Bowl', 'Stall E5', 'Fresh, healthy, and organic acai bowls to keep your energy up.', 'Food', 'Athletics Track Entrance', -37.7965, 144.9620, 1),
('Craft Coffee Cart', 'Stall F6', 'Locally roasted artisan coffee, cold brew, and fresh croissants.', 'Drinks', 'Library Courtyard', -37.7970, 144.9612, 1);

-- ─── Announcements ─────────────────────────────────────────
INSERT INTO announcements (title, content, type) VALUES
('Welcome to the Fall 2026 Semester!', 'Festival Hub is your central place to discover amazing campus events, connect with clubs, and make unforgettable memories this semester.', 'success'),
('Hackathon Registrations Closing Soon', 'Just a reminder that the Global Hackathon 2026 registrations close in 48 hours. Secure your spot now!', 'warning'),
('New Feature: Save Your Favorite Events', 'We have just launched a new feature that allows you to bookmark events. Look out for the heart icon on event cards!', 'info'),
('Food Fiesta Map Updated', 'The layout for the International Food Fiesta has been updated. Check the event page for the new vendor stall locations.', 'info');

-- ─── Sample Bookings ───────────────────────────────────────
INSERT INTO bookings (event_id, visitor_name, visitor_email, ticket_type, quantity, booking_ref) VALUES
(2, 'Sarah Johnson', 'sarah.j@student.edu', 'General', 1, 'FH-00101'),
(1, 'Michael Chen', 'mchen@student.edu', 'VIP', 2, 'FH-00102'),
(4, 'Emma Williams', 'emmaw@student.edu', 'General', 3, 'FH-00103'),
(7, 'James Brown', 'jbrown@student.edu', 'General', 1, 'FH-00104');

UPDATE events SET tickets_available = tickets_available - 1 WHERE id = 2;
UPDATE events SET tickets_available = tickets_available - 2 WHERE id = 1;
UPDATE events SET tickets_available = tickets_available - 3 WHERE id = 4;
UPDATE events SET tickets_available = tickets_available - 1 WHERE id = 7;
