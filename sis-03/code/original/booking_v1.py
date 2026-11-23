def can_book(start, end, now, blocked, existing):
    if blocked:
        return False
    if start < 0 or end > 1440 or start >= end:
        return False
    if start <= now:
        return False
    if end - start > 120:
        return False
    for b_start, b_end in existing:
        if start <= b_end and end >= b_start:
            return False
    return True
