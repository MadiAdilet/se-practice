def can_book(start: int, end: int, now: int, blocked: bool, existing: list[tuple[int, int]]) -> bool:
    """
    Evaluates room availability according to AC1-AC4 rules.
    AC1: 0 <= start < end <= 1440, start > now
    AC2: end - start <= 120
    AC3: reject if blocked is True
    AC4: reject overlapping bookings (boundary touching at endpoints is allowed)
    """
    if blocked:
        return False

    if not (isinstance(start, int) and isinstance(end, int) and isinstance(now, int)):
        return False

    if not (0 <= start < end <= 1440):
        return False

    if start <= now:
        return False

    if (end - start) > 120:
        return False

    for b_start, b_end in existing:
        # Overlap condition: start < b_end and end > b_start
        # Boundary touching (start == b_end or end == b_start) evaluates to False (no overlap)
        if start < b_end and end > b_start:
            return False

    return True