# Festival Hub — API Documentation

**Base URL:** `http://localhost:5000/api`  
**Format:** JSON  
**Authentication:** Session-based (cookie). Call `POST /admin/login` first. Admin session persists for 24 hours.

---

## Authentication

### POST `/admin/login`
Log in as administrator.

**Access:** Public  
**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**Success Response (200):**
```json
{
  "message": "Login successful",
  "admin": { "id": 1, "username": "admin", "name": "Festival Admin" }
}
```
**Error Response (401):**
```json
{ "error": "Invalid credentials" }
```

---

### GET `/admin/me`
Check if the current session is authenticated.

**Access:** Public  
**Success Response (200):**
```json
{ "authenticated": true, "username": "admin" }
```
**Unauthenticated (401):**
```json
{ "authenticated": false }
```

---

### POST `/admin/logout`
Destroy the current admin session.

**Access:** Public  
**Success Response (200):**
```json
{ "message": "Logged out successfully" }
```

---

## Events

### GET `/events`
Get all events. Supports optional filtering via query parameters.

**Access:** Public  
**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `stage` | string | Filter by stage name (e.g. `Main Stage`) |
| `date` | string | Filter by date (format: `YYYY-MM-DD`) |
| `category` | string | Filter by category (e.g. `Electronic`) |
| `search` | string | Search in title, description, or stage |

**Success Response (200):** Array of event objects.
```json
[
  {
    "id": 1,
    "title": "Opening Ceremony",
    "description": "Kick off the Festival Hub Music Festival...",
    "stage": "Main Stage",
    "event_date": "2026-08-15",
    "start_time": "17:00:00",
    "end_time": "18:00:00",
    "category": "Ceremony",
    "image_url": null,
    "tickets_available": 496,
    "created_at": "2026-08-02T..."
  }
]
```

---

### GET `/events/:id`
Get a single event by ID.

**Access:** Public  
**URL Params:** `id` — event ID  
**Success Response (200):** Single event object  
**Error Response (404):**
```json
{ "error": "Event not found" }
```

---

### POST `/events`
Create a new event.

**Access:** Admin only  
**Request Body:**
```json
{
  "title": "DJ Alpha Live",
  "description": "Electronic music powerhouse...",
  "stage": "Main Stage",
  "event_date": "2026-08-15",
  "start_time": "18:30",
  "end_time": "20:00",
  "category": "Electronic",
  "image_url": null,
  "tickets_available": 450
}
```
**Required fields:** `title`, `event_date`, `start_time`  
**Success Response (201):**
```json
{ "message": "Event created successfully", "id": 15 }
```
**Error Response (400):**
```json
{ "error": "title, event_date, and start_time are required" }
```

---

### PUT `/events/:id`
Update an existing event.

**Access:** Admin only  
**Request Body:** Same as POST  
**Success Response (200):**
```json
{ "message": "Event updated successfully" }
```
**Error Response (404):**
```json
{ "error": "Event not found" }
```

---

### DELETE `/events/:id`
Delete an event.

**Access:** Admin only  
**Success Response (200):**
```json
{ "message": "Event deleted successfully" }
```

---

## Bookings

### POST `/bookings`
Create a new ticket booking (visitor).

**Access:** Public  
**Request Body:**
```json
{
  "event_id": 2,
  "visitor_name": "Jane Smith",
  "visitor_email": "jane.smith@example.com",
  "ticket_type": "General",
  "quantity": 2
}
```
**Field Rules:**
- `ticket_type`: must be `"General"` or `"VIP"`
- `quantity`: must be between 1 and 10

**Success Response (201):**
```json
{
  "message": "Booking confirmed!",
  "booking_ref": "FH-00009",
  "event": "DJ Alpha Live",
  "ticket_type": "General",
  "quantity": 2
}
```
**Error Responses:**
- `400` — Missing fields, invalid ticket_type, invalid quantity
- `400` — Not enough tickets available
- `404` — Event not found

---

### GET `/bookings/:ref`
Look up a booking by reference number (visitor receipt).

**Access:** Public  
**URL Params:** `ref` — booking reference (e.g. `FH-00001`)  
**Success Response (200):**
```json
{
  "id": 1,
  "booking_ref": "FH-00001",
  "visitor_name": "Sarah Johnson",
  "visitor_email": "sarah.j@email.com",
  "ticket_type": "VIP",
  "quantity": 2,
  "event_title": "Opening Ceremony",
  "event_date": "2026-08-15",
  "stage": "Main Stage",
  "start_time": "17:00:00"
}
```

---

### GET `/bookings`
Get all bookings with event details.

**Access:** Admin only  
**Success Response (200):** Array of booking objects with event info.

---

### DELETE `/bookings/:id`
Cancel a booking and restore ticket availability.

**Access:** Admin only  
**Success Response (200):**
```json
{ "message": "Booking cancelled and tickets restored" }
```

---

## Vendors

### GET `/vendors`
Get all vendors.

**Access:** Public  
**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `category` | string | `Food` \| `Drinks` \| `Merchandise` \| `Attraction` |

**Success Response (200):** Array of vendor objects.

---

### GET `/vendors/:id`
Get a single vendor.

**Access:** Public

---

### POST `/vendors`
Create a new vendor.

**Access:** Admin only  
**Request Body:**
```json
{
  "name": "Sushi Bar",
  "description": "Fresh Japanese sushi rolls.",
  "category": "Food",
  "location": "Food Court - Stall C1",
  "image_url": null,
  "is_active": 1
}
```
**Required:** `name`, `category`  
**Valid categories:** `Food`, `Drinks`, `Merchandise`, `Attraction`

---

### PUT `/vendors/:id`
Update a vendor.

**Access:** Admin only  
**Request Body:** Same as POST

---

### DELETE `/vendors/:id`
Delete a vendor.

**Access:** Admin only

---

## Announcements

### GET `/announcements`
Get all announcements newest first.

**Access:** Public

---

### GET `/announcements/:id`
Get a single announcement.

**Access:** Public

---

### POST `/announcements`
Create a new announcement.

**Access:** Admin only  
**Request Body:**
```json
{
  "title": "Stage Delay Notice",
  "content": "The Main Stage will be delayed by 20 minutes.",
  "type": "warning"
}
```
**Valid types:** `info` | `warning` | `alert` | `success`

---

### PUT `/announcements/:id`
Update an announcement.

**Access:** Admin only

---

### DELETE `/announcements/:id`
Delete an announcement.

**Access:** Admin only

---

## Contact

### POST `/contact`
Submit a visitor contact message.

**Access:** Public  
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "subject": "Parking Question",
  "message": "Is there accessible parking near Gate A?"
}
```
**Required:** `name`, `email`, `message`  
**Success Response (201):**
```json
{ "message": "Your message has been sent successfully! We will be in touch soon.", "id": 4 }
```

---

### GET `/contact`
Get all contact messages.

**Access:** Admin only

---

### DELETE `/contact/:id`
Delete a contact message.

**Access:** Admin only

---

## Dashboard

### GET `/dashboard/stats`
Get dashboard statistics and recent activity.

**Access:** Admin only  
**Success Response (200):**
```json
{
  "total_events": 14,
  "total_bookings": 8,
  "total_vendors": 15,
  "total_messages": 3,
  "total_announcements": 8,
  "ticket_summary": [
    { "ticket_type": "General", "total_tickets": 14 },
    { "ticket_type": "VIP", "total_tickets": 5 }
  ],
  "recent_bookings": [...],
  "upcoming_events": [...]
}
```

---

## Error Reference

| HTTP Status | Meaning |
|---|---|
| 200 | OK — Request succeeded |
| 201 | Created — Resource created |
| 400 | Bad Request — Missing or invalid fields |
| 401 | Unauthorised — Admin login required |
| 404 | Not Found — Resource does not exist |
| 500 | Internal Server Error — Database or server error |

---

## Notes

- All admin routes return `401` if the admin session cookie is not present.
- Booking creation automatically decrements `tickets_available` on the event.
- Booking cancellation (DELETE) automatically restores `tickets_available`.
- The admin password is stored as a bcrypt hash in the database.
