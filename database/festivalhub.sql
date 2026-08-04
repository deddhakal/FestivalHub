-- ============================================================
--  Festival Hub Database
--  festivalhub.sql
--  Run this file in MySQL to set up the full database.
-- ============================================================

CREATE DATABASE IF NOT EXISTS festivalhub;
USE festivalhub;

-- ─── Drop tables if they exist (for clean re-import) ───────
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
  image_url VARCHAR(255),
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
  description TEXT,
  category ENUM('Food', 'Drinks', 'Merchandise', 'Attraction') NOT NULL,
  location VARCHAR(100),
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
-- bcrypt hash of 'admin123'
INSERT INTO admins (username, password_hash, name) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7y', 'Festival Admin');

-- ─── Events ────────────────────────────────────────────────
INSERT INTO events (title, description, stage, event_date, start_time, end_time, category, tickets_available) VALUES
-- Day 1: Friday Aug 15 2026
('Opening Ceremony', 'Kick off the Festival Hub Music Festival with a spectacular opening show including fireworks and a light display.', 'Main Stage', '2026-08-15', '17:00:00', '18:00:00', 'Ceremony', 500),
('DJ Alpha Live', 'Electronic music powerhouse DJ Alpha brings high-energy beats to start the night.', 'Main Stage', '2026-08-15', '18:30:00', '20:00:00', 'Electronic', 450),
('Neon Lights', 'Indie pop sensation Neon Lights performs their chart-topping hits live.', 'Dance Arena', '2026-08-15', '19:00:00', '20:30:00', 'Pop', 300),
('Jazz Under Stars', 'A smooth jazz performance perfect for a relaxing evening.', 'Garden Stage', '2026-08-15', '20:00:00', '21:30:00', 'Jazz', 200),
('Midnight Beats', 'Late night DJ set to keep the energy going into the early hours.', 'Dance Arena', '2026-08-15', '22:00:00', '00:00:00', 'Electronic', 350),

-- Day 2: Saturday Aug 16 2026
('Morning Yoga Session', 'Start your day with a guided yoga session in the festival grounds.', 'Garden Stage', '2026-08-16', '08:00:00', '09:00:00', 'Wellness', 100),
('The Resonance', 'Alt-rock band The Resonance delivers a powerful mid-afternoon set.', 'Main Stage', '2026-08-16', '13:00:00', '14:30:00', 'Rock', 480),
('Street Beat Crew', 'Award-winning dance crew showcase extraordinary hip-hop choreography.', 'Dance Arena', '2026-08-16', '14:00:00', '15:00:00', 'Dance', 280),
('Luna Solaris', 'Electrifying pop star Luna Solaris headlines the main stage on Saturday night.', 'Main Stage', '2026-08-16', '20:00:00', '22:00:00', 'Pop', 500),
('Bass Drop Night', 'The ultimate bass music experience with guest DJs from around the world.', 'Dance Arena', '2026-08-16', '22:30:00', '01:00:00', 'Electronic', 350),

-- Day 3: Sunday Aug 17 2026
('Acoustic Morning', 'A peaceful acoustic performance to ease into the final festival day.', 'Garden Stage', '2026-08-17', '10:00:00', '11:30:00', 'Acoustic', 180),
('Kids Festival Fun', 'Family friendly entertainment with games, face painting, and live music.', 'Family Zone', '2026-08-17', '11:00:00', '13:00:00', 'Family', 200),
('Reggae Vibes', 'Soulful reggae rhythms from headliner group Reggae Vibes International.', 'Main Stage', '2026-08-17', '15:00:00', '17:00:00', 'Reggae', 420),
('Closing Spectacular', 'A grand finale featuring a medley of performers and a fireworks display.', 'Main Stage', '2026-08-17', '20:00:00', '22:00:00', 'Ceremony', 500);

-- ─── Vendors ────────────────────────────────────────────────
INSERT INTO vendors (name, description, category, location, is_active) VALUES
-- Food
('Burger House', 'Gourmet burgers made fresh to order. Try our signature Chilli Cheese Burger!', 'Food', 'Food Court - Stall A1', 1),
('Pizza Paradise', 'Authentic wood-fired pizzas with a selection of classic and gourmet toppings.', 'Food', 'Food Court - Stall A2', 1),
('Taco Fiesta', 'Mexican street food — tacos, burritos, nachos and more with fresh salsa.', 'Food', 'Food Court - Stall A3', 1),
('The Noodle Bar', 'Asian fusion noodle dishes including Pad Thai, Ramen, and Stir Fry.', 'Food', 'Food Court - Stall B1', 1),
('BBQ Smokehouse', 'Slow-smoked BBQ ribs, brisket, and pulled pork sandwiches.', 'Food', 'Food Court - Stall B2', 1),
('Garden Greens', 'Vegan and vegetarian options — fresh salads, wraps, and fruit bowls.', 'Food', 'Food Court - Stall B3', 1),
-- Drinks
('The Beer Garden', 'Craft beers on tap — local and international selections including IPAs and Lagers.', 'Drinks', 'Drinks Zone - D1', 1),
('Cocktail Corner', 'Hand-crafted cocktails and mocktails mixed fresh to order.', 'Drinks', 'Drinks Zone - D2', 1),
('Coffee & Chill', 'Specialty coffee, cold brew, smoothies, and freshly squeezed juices.', 'Drinks', 'Drinks Zone - D3', 1),
-- Merchandise
('FestHub Official Store', 'Official Festival Hub merchandise — T-shirts, hats, hoodies, and posters.', 'Merchandise', 'Merchandise Hub - M1', 1),
('Vinyl & Beats', 'Music records, CDs, and artist merchandise from performing acts.', 'Merchandise', 'Merchandise Hub - M2', 1),
('Festival Accessories', 'Glow sticks, festival accessories, jewellery, and unique handmade crafts.', 'Merchandise', 'Merchandise Hub - M3', 1),
-- Attractions
('Ferris Wheel', 'Classic carnival Ferris Wheel with panoramic festival views. All ages welcome!', 'Attraction', 'Fairground Zone', 1),
('Photo Booth', 'Professional photo booth with fun props. Get your festival moments printed instantly!', 'Attraction', 'Near Main Stage', 1),
('Carnival Games', 'Traditional carnival games — ring toss, duck pond, and skill challenges with prizes.', 'Attraction', 'Fairground Zone', 1);

-- ─── Announcements ─────────────────────────────────────────
INSERT INTO announcements (title, content, type) VALUES
('Welcome to Festival Hub 2026!', 'We are thrilled to welcome you to the Festival Hub Music and Entertainment Festival 2026! Three days of incredible performances, food, and fun await you. Check the schedule for all event times and enjoy the festival responsibly.', 'success'),
('Festival Map Now Available', 'The interactive festival map is now live on our website. Use it to find stages, food stalls, parking, medical tents, and all attraction zones.', 'info'),
('Main Stage Sound Check at 4PM', 'Please note that a sound check will be conducted at the Main Stage at 4:00 PM on Friday August 15. There may be brief noise during this period.', 'info'),
('Lost and Found Located at Gate B', 'Our Lost and Found desk is located at Gate B near the main entrance. If you have lost any belongings please visit our friendly staff there.', 'info'),
('Weather Advisory — Bring Sunscreen!', 'The Bureau of Meteorology is forecasting warm sunny conditions across all three festival days. We recommend bringing sunscreen, a hat, and staying hydrated throughout the day.', 'warning'),
('Fireworks Display Sunday 9PM', 'Do not miss our spectacular closing fireworks display on Sunday August 17 at 9:00 PM, immediately following the Closing Spectacular performance on the Main Stage.', 'success'),
('Cashless Payments Accepted', 'All vendors and ticket counters accept cashless payments including EFTPOS, Visa, Mastercard, and Apple Pay. ATMs are available at Gate A and Gate C.', 'info'),
('Medical Tent — Gate A', 'A fully staffed medical tent is available at Gate A for the duration of the festival. For emergencies please call festival security on the number shown on your wristband.', 'alert');

-- ─── Sample Bookings ───────────────────────────────────────
INSERT INTO bookings (event_id, visitor_name, visitor_email, ticket_type, quantity, booking_ref) VALUES
(1, 'Sarah Johnson', 'sarah.j@email.com', 'VIP', 2, 'FH-00001'),
(2, 'Michael Chen', 'mchen@email.com', 'General', 3, 'FH-00002'),
(3, 'Emma Williams', 'emmaw@email.com', 'General', 1, 'FH-00003'),
(9, 'James Brown', 'jbrown@email.com', 'VIP', 2, 'FH-00004'),
(13, 'Priya Sharma', 'priya.s@email.com', 'General', 4, 'FH-00005'),
(1, 'Lucas Martinez', 'lucasm@email.com', 'General', 2, 'FH-00006'),
(5, 'Aisha Patel', 'aishap@email.com', 'VIP', 1, 'FH-00007'),
(14, 'Tom Wilson', 'tomw@email.com', 'General', 5, 'FH-00008');

-- Update ticket counts to reflect sample bookings
UPDATE events SET tickets_available = tickets_available - 2 WHERE id = 1;
UPDATE events SET tickets_available = tickets_available - 3 WHERE id = 2;
UPDATE events SET tickets_available = tickets_available - 1 WHERE id = 3;
UPDATE events SET tickets_available = tickets_available - 2 WHERE id = 9;
UPDATE events SET tickets_available = tickets_available - 4 WHERE id = 13;
UPDATE events SET tickets_available = tickets_available - 2 WHERE id = 1;
UPDATE events SET tickets_available = tickets_available - 1 WHERE id = 5;
UPDATE events SET tickets_available = tickets_available - 5 WHERE id = 14;

-- ─── Sample Contact Messages ───────────────────────────────
INSERT INTO contact_messages (name, email, subject, message) VALUES
('Alice Thompson', 'alice.t@email.com', 'Parking Information', 'Hi, I wanted to know where the festival parking is located and if there is a fee. Thank you!'),
('David Park', 'dpark@email.com', 'Accessibility', 'I use a wheelchair and wanted to confirm that the festival grounds are accessible. Are there accessible viewing areas near the Main Stage?'),
('Chloe Reed', 'chloe.r@email.com', 'Sponsorship Enquiry', 'Our company is interested in sponsoring the Festival Hub event. Could you please send us the sponsorship packages available?');
