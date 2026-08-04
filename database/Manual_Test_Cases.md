# Festival Hub — Manual Test Cases

**Project:** Festival Hub Web Application  
**Testing Type:** Manual (Functional) + API (Postman)  
**Tester:** QA Team  
**Date:** August 2026  
**Environment:** Local — Backend: http://localhost:5000 | Frontend: http://localhost:5173

---

## How to Run Tests

1. Import `FestivalHub_API.postman_collection.json` into Postman.
2. Start the backend: `cd backend && node server.js`
3. Start the frontend: `cd frontend && npm run dev`
4. Import the database: `mysql -u root -p < database/festivalhub.sql`
5. Execute each test case below and record results.

---

## Section 1: Admin Authentication

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-01 | Admin Login — Valid | POST /api/admin/login with username=admin, password=admin123 | 200 OK. Returns admin object. Session cookie set. | | |
| TC-02 | Admin Login — Wrong Password | POST /api/admin/login with password=wrongpass | 401 Unauthorised. Returns "Invalid credentials". | | |
| TC-03 | Admin Login — Missing Fields | POST /api/admin/login with empty body | 400 Bad Request. Returns error message. | | |
| TC-04 | Session Check — Logged In | GET /api/admin/me after TC-01 | 200 OK. Returns `{"authenticated": true}`. | | |
| TC-05 | Session Check — Not Logged In | GET /api/admin/me in fresh session | 401. Returns `{"authenticated": false}`. | | |
| TC-06 | Admin Logout | POST /api/admin/logout after login | 200 OK. Session destroyed. Subsequent /me returns 401. | | |

---

## Section 2: Events — Public Access

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-07 | Get All Events | GET /api/events | 200 OK. Returns array of 14 events ordered by date/time. | | |
| TC-08 | Filter Events by Stage | GET /api/events?stage=Main Stage | 200 OK. Returns only Main Stage events. | | |
| TC-09 | Filter Events by Date | GET /api/events?date=2026-08-15 | 200 OK. Returns only Friday events (5 results). | | |
| TC-10 | Filter Events by Category | GET /api/events?category=Electronic | 200 OK. Returns only Electronic category events. | | |
| TC-11 | Search Events | GET /api/events?search=DJ | 200 OK. Returns events containing "DJ" in title/description. | | |
| TC-12 | Get Single Event | GET /api/events/1 | 200 OK. Returns Opening Ceremony event object. | | |
| TC-13 | Get Non-Existent Event | GET /api/events/9999 | 404 Not Found. Returns "Event not found". | | |

---

## Section 3: Events — Admin CRUD

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-14 | Create Event — Valid | Login as admin. POST /api/events with valid body. | 201 Created. Returns `{"message": "Event created successfully", "id": N}`. | | |
| TC-15 | Create Event — Missing Title | POST /api/events with no title field. | 400 Bad Request. Returns validation error. | | |
| TC-16 | Create Event — No Auth | POST /api/events without admin session. | 401 Unauthorised. | | |
| TC-17 | Update Event — Valid | PUT /api/events/1 with updated title. | 200 OK. Returns "Event updated successfully". Verify by GET /api/events/1. | | |
| TC-18 | Update Event — Not Found | PUT /api/events/9999 with valid body. | 404 Not Found. | | |
| TC-19 | Delete Event — Valid | DELETE /api/events/15 (newly created). | 200 OK. Returns "Event deleted successfully". Verify by GET /api/events/15 → 404. | | |
| TC-20 | Delete Event — No Auth | DELETE /api/events/1 without admin session. | 401 Unauthorised. | | |

---

## Section 4: Bookings — Visitor

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-21 | Create General Booking | POST /api/bookings with event_id=2, ticket_type=General, quantity=2. | 201 Created. Returns booking_ref (e.g. FH-00009). | | |
| TC-22 | Create VIP Booking | POST /api/bookings with ticket_type=VIP, quantity=1. | 201 Created. Returns VIP booking confirmation. | | |
| TC-23 | Check Ticket Decrement | GET /api/events/2 before and after TC-21. | tickets_available decreases by 2 after booking. | | |
| TC-24 | Lookup Booking by Ref | GET /api/bookings/FH-00001. | 200 OK. Returns booking details with event info. | | |
| TC-25 | Booking — Invalid ticket_type | POST /api/bookings with ticket_type=Premium. | 400 Bad Request. Returns validation error. | | |
| TC-26 | Booking — Quantity > 10 | POST /api/bookings with quantity=11. | 400 Bad Request. Returns "quantity must be between 1 and 10". | | |
| TC-27 | Booking — Insufficient Tickets | POST /api/bookings with quantity=9999. | 400 Bad Request. Returns "Not enough tickets available". | | |
| TC-28 | Booking — Missing Fields | POST /api/bookings with only event_id provided. | 400 Bad Request. Returns "All fields are required". | | |
| TC-29 | Booking — Invalid Event | POST /api/bookings with event_id=9999. | 404 Not Found. Returns "Event not found". | | |

---

## Section 5: Bookings — Admin

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-30 | Get All Bookings (Admin) | Login as admin. GET /api/bookings. | 200 OK. Returns array of bookings with event details. | | |
| TC-31 | Get Bookings — No Auth | GET /api/bookings without session. | 401 Unauthorised. | | |
| TC-32 | Cancel Booking (Admin) | DELETE /api/bookings/1. | 200 OK. "Booking cancelled and tickets restored". Verify ticket count restored. | | |

---

## Section 6: Vendors

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-33 | Get All Vendors | GET /api/vendors. | 200 OK. Returns 15 vendors ordered by category. | | |
| TC-34 | Filter by Food | GET /api/vendors?category=Food. | 200 OK. Returns only Food vendors (6 results). | | |
| TC-35 | Filter by Attraction | GET /api/vendors?category=Attraction. | 200 OK. Returns only Attraction vendors (3 results). | | |
| TC-36 | Get Single Vendor | GET /api/vendors/1. | 200 OK. Returns Burger House vendor object. | | |
| TC-37 | Create Vendor (Admin) | Login. POST /api/vendors with name=Sushi Bar, category=Food. | 201 Created. Returns new vendor ID. | | |
| TC-38 | Create Vendor — Invalid Category | POST /api/vendors with category=InvalidType. | 400 Bad Request. Returns valid categories list. | | |
| TC-39 | Update Vendor (Admin) | PUT /api/vendors/1 with updated name. | 200 OK. "Vendor updated successfully". | | |
| TC-40 | Delete Vendor (Admin) | DELETE /api/vendors/16 (newly created). | 200 OK. "Vendor deleted successfully". Verify with GET → 404. | | |

---

## Section 7: Announcements

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-41 | Get All Announcements | GET /api/announcements. | 200 OK. Returns 8 announcements newest first. | | |
| TC-42 | Get Single Announcement | GET /api/announcements/1. | 200 OK. Returns announcement object. | | |
| TC-43 | Create Announcement (Admin) | Login. POST /api/announcements with title, content, type=warning. | 201 Created. Returns new ID. | | |
| TC-44 | Create Announcement — Missing Content | POST /api/announcements with only title. | 400 Bad Request. "title and content are required". | | |
| TC-45 | Update Announcement (Admin) | PUT /api/announcements/1 with updated content. | 200 OK. "Announcement updated successfully". | | |
| TC-46 | Delete Announcement (Admin) | DELETE /api/announcements/9 (newly created). | 200 OK. "Announcement deleted successfully". | | |

---

## Section 8: Contact Form

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-47 | Submit Contact — Valid | POST /api/contact with name, email, subject, message. | 201 Created. Returns success message. | | |
| TC-48 | Submit Contact — Invalid Email | POST /api/contact with email=notanemail. | 400 Bad Request. "Invalid email address format". | | |
| TC-49 | Submit Contact — Missing Message | POST /api/contact with name and email only. | 400 Bad Request. Returns missing field error. | | |
| TC-50 | Get All Messages (Admin) | Login. GET /api/contact. | 200 OK. Returns all contact messages. | | |
| TC-51 | Delete Message (Admin) | DELETE /api/contact/1. | 200 OK. "Message deleted successfully". | | |
| TC-52 | Get Messages — No Auth | GET /api/contact without session. | 401 Unauthorised. | | |

---

## Section 9: Dashboard

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-53 | Get Dashboard Stats (Admin) | Login. GET /api/dashboard/stats. | 200 OK. Returns total_events=14, total_vendors=15, total_announcements=8, recent_bookings array, upcoming_events array. | | |
| TC-54 | Dashboard — No Auth | GET /api/dashboard/stats without session. | 401 Unauthorised. | | |
| TC-55 | Stats Update After Booking | Book tickets (TC-21), then GET /api/dashboard/stats. | total_bookings count has increased by 1. | | |

---

## Section 10: Frontend UI Tests

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-56 | Home Page Loads | Navigate to http://localhost:5173. | Home page displays with hero banner, upcoming events, and navigation. | | |
| TC-57 | Navigation Works | Click all navbar links (Events, Booking, Map, etc). | Each page loads without errors. | | |
| TC-58 | Events Page — All Events | Navigate to /events. | All 14 events display in cards with date, stage, and time. | | |
| TC-59 | Events Page — Filter | Use day filter on /events (select Friday). | Only Friday Aug 15 events are shown. | | |
| TC-60 | Events Page — Search | Type "DJ" in search box. | Only events matching "DJ" appear. | | |
| TC-61 | Event Detail | Click an event card. | Event detail page shows full info and Book Now button. | | |
| TC-62 | Booking Flow — Valid | Fill booking form and submit. | Booking confirmation screen shows with booking reference number. | | |
| TC-63 | Booking Flow — Empty Form | Submit booking form without filling fields. | Validation errors shown. No booking created. | | |
| TC-64 | Festival Map | Navigate to /map. | Map image shows with clickable zones. Clicking a zone shows info popup. | | |
| TC-65 | Food & Attractions | Navigate to /food-attractions. | Vendor cards show by category (Food, Drinks, Merchandise, Attractions). | | |
| TC-66 | Announcements Page | Navigate to /announcements. | All 8 announcements display with type-coded styling. | | |
| TC-67 | Contact Form — Valid | Fill and submit contact form. | Success message shown. Message saved in database. | | |
| TC-68 | Admin Login UI | Navigate to /admin/login. | Login form displays. Enter admin/admin123 → redirect to dashboard. | | |
| TC-69 | Admin Dashboard | Log in as admin. | Dashboard shows stat cards: total events, bookings, vendors, messages. | | |
| TC-70 | Admin — Add Event | In Admin > Events, click Add Event, fill form, submit. | New event appears in events list. | | |
| TC-71 | Admin — Edit Event | Click Edit on an event, change title, save. | Updated title shows in events list. | | |
| TC-72 | Admin — Delete Event | Click Delete on an event, confirm. | Event removed from list. | | |
| TC-73 | Admin — Add Vendor | In Admin > Vendors, add new vendor. | Vendor appears in vendor list. | | |
| TC-74 | Admin — Post Announcement | In Admin > Announcements, create new announcement. | Appears at top of announcements page. | | |
| TC-75 | Admin — View Bookings | In Admin > Tickets, view booking table. | All bookings display with visitor names and event info. | | |
| TC-76 | Responsive Design | View site on mobile (375px width using browser DevTools). | Layout adapts correctly. No horizontal overflow. Navigation is accessible. | | |

---

## Section 11: Security Tests

| TC# | Feature | Test Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| TC-77 | Access Admin Panel Without Login | Navigate to /admin/dashboard directly. | Redirected to /admin/login page. | | |
| TC-78 | API Auth Guard | Call DELETE /api/events/1 without admin session (Postman). | 401 Unauthorised. Event not deleted. | | |
| TC-79 | SQL Injection Attempt | Enter `' OR '1'='1` in search field. | Query handled safely. No SQL error. No unintended data returned. | | |

---

## Test Summary Template

| Category | Total TCs | Pass | Fail | Not Run |
|---|---|---|---|---|
| Authentication | 6 | | | |
| Events — Public | 7 | | | |
| Events — Admin CRUD | 7 | | | |
| Bookings — Visitor | 9 | | | |
| Bookings — Admin | 3 | | | |
| Vendors | 8 | | | |
| Announcements | 6 | | | |
| Contact | 6 | | | |
| Dashboard | 3 | | | |
| Frontend UI | 21 | | | |
| Security | 3 | | | |
| **TOTAL** | **79** | | | |

---

*Fill in Actual Result and Pass/Fail columns after running each test. Use this table in the Assessment 3 report under the Testing section.*
