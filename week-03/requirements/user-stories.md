# User Stories — Smart Campus Study Room Booking

### US-01 — View availability
As a Student, I want to view which rooms are free and when, so that I can find a suitable time to study.
Priority: High
Assumption: Availability can be checked for any future date without restriction.

### US-02 — Book a room
As a Student, I want to book a free room for a specific time slot, so that I have a guaranteed place to study.
Priority: High
Assumption: A booking that starts exactly when another one for the same room ends is not treated as an overlap.

### US-03 — Cancel a booking
As a Student, I want to cancel a booking I made, so that I free the room for others if my plans change.
Priority: High
Assumption: A student can cancel only the bookings they created themselves.

### US-04 — Receive confirmation
As a Student, I want to receive a confirmation whenever I book or cancel a room, so that I know the system has recorded my action.
Priority: Medium
Assumption: The confirmation is generated automatically by the system, not triggered manually by any actor.

### US-05 — Block or unblock a room
As an Administrator, I want to block a room that is out of service and unblock it once it is usable again, so that students never book a room they cannot actually use.
Priority: High
Assumption: A blocked room is removed from the availability list shown to students immediately.

### US-06 — Review usage
As an Administrator, I want to review how each room was used over a period, so that I can identify rooms that are underused or overbooked.
Priority: Medium
Assumption: Usage data is available for any past date range the administrator selects.