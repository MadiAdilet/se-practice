# Acceptance Criteria — Smart Campus Study Room Booking

## Assumptions
- Overlap (R3): a booking that starts exactly when another booking for the same room ends is NOT treated as an overlap — back-to-back bookings are allowed.
- Duration (R2): a booking of exactly two hours is allowed; only bookings strictly longer than two hours are rejected.
- "The future" (R1) means strictly later than the moment the booking request is submitted.
- All criteria below assume a single library timezone shared by the whole system.

## US-02 — Book a room

AC-01: Given a room is free for the requested slot, when a Student books it for a future time within the two-hour limit, then the booking is created and a confirmation is queued.
AC-02: Given a Student submits a booking that starts in the past, when the request is processed, then the system rejects it as invalid.
AC-03: Given a Student requests a booking longer than two hours, when the request is submitted, then the system rejects it for exceeding the maximum duration.
AC-04: Given a room already has a booking from 10:00 to 12:00, when another Student tries to book the same room for 11:00 to 13:00, then the booking is rejected because it overlaps an existing booking.
AC-05: Given a room has a booking ending at 12:00, when a Student books the same room starting at 12:00, then the booking succeeds, because touching bookings are not overlapping.

## US-03 — Cancel a booking

AC-06: Given a Student has an existing future booking, when they cancel it before the start time, then the booking is removed and the room becomes available again for that slot.
AC-07: Given a booking belongs to another student, when a Student tries to cancel it, then the system rejects the request.
AC-08: Given a booking ID does not exist or was already cancelled, when a Student submits a cancellation for it, then the system returns an error and no state changes.
AC-09: Given a Student cancels a valid booking, when the cancellation completes, then a confirmation is generated for that action.

## US-05 — Block or unblock a room

AC-10: Given a room is currently available, when an Administrator blocks it, then the room no longer appears as bookable.
AC-11: Given a room is blocked, when an Administrator unblocks it, then the room becomes available for booking again.
AC-12: Given a room is blocked, when a Student attempts to book it anyway, then the system prevents the booking and returns an error.
AC-13: Given a room is already blocked, when an Administrator tries to block it again, then the system reports it is already blocked and makes no further change.