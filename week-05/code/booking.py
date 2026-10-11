def can_book(start, end, now, blocked, existing):
    """
    Determines if a room can be booked based on acceptance criteria AC1-AC5.
    
    Parameters:
        start (int): Requested start time in minutes after midnight.
        end (int): Requested end time in minutes after midnight.
        now (int): Current time in minutes after midnight (0-1439).
        blocked (bool): Whether the room is blocked from booking.
        existing (iterable): Iterable of valid (start, end) tuples for active bookings.
        
    Returns:
        bool: True if all criteria AC1-AC4 hold, False otherwise.
    """
    # AC3: Room block status check
    if blocked:
        return False

    # AC1: Time range and progression checks
    # 0 <= start < end <= 1440 and start must be strictly greater than now
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: Maximum duration check (at most 120 minutes)
    if (end - start) > 120:
        return False

    # AC4: Overlap check with active existing bookings
    # Two half-open intervals [start, end) and [b_start, b_end) overlap if:
    # b_start < end AND start < b_end
    for b_start, b_end in existing:
        if b_start < end and start < b_end:
            return False

    # AC5: All criteria AC1-AC4 hold
    return True