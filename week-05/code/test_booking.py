import unittest
from booking import can_book

# Base input for most tests: now=540 (09:00), room not blocked,
# one existing booking (600, 660) = 10:00-11:00.
# Every expected value below comes from AC1-AC5, not from running the code.


class BookingTests(unittest.TestCase):
    # ---- the six cases from the task table ----

    def test_touching_end_is_allowed(self):
        # AC4: request starts exactly when the existing booking ends
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_overlap_is_rejected(self):
        # AC4: partial overlap
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_blocked_room_is_rejected(self):
        # AC3: everything else is valid, only blocked=True rejects
        result = can_book(660, 720, 540, True, [(600, 660)])
        self.assertIs(result, False)

    def test_exactly_two_hours_is_allowed(self):
        # AC2: 840 - 720 = 120 minutes, "at most 120"
        result = can_book(720, 840, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_over_two_hours_is_rejected(self):
        # AC2: 841 - 720 = 121 minutes
        result = can_book(720, 841, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_start_equal_to_now_is_rejected(self):
        # AC1: start must be > now, and 540 is not > 540
        result = can_book(540, 570, 540, False, [(600, 660)])
        self.assertIs(result, False)

    # ---- zero-length and reversed times (AC1: start < end) ----

    def test_zero_length_is_rejected(self):
        # AC1: start == end. Only AC1 rejects it (no overlap, not blocked).
        result = can_book(700, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_reversed_times_are_rejected(self):
        # AC1: start > end. Duration is negative, so AC2 would not reject it.
        result = can_book(760, 700, 540, False, [(600, 660)])
        self.assertIs(result, False)

    # ---- day bounds (AC1: end <= 1440) ----

    def test_end_of_day_1440_is_allowed(self):
        # AC1: end == 1440 is inside 0 <= start < end <= 1440
        result = can_book(1380, 1440, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_end_after_1440_is_rejected(self):
        # AC1: end == 1441. Duration is 61, so only AC1 rejects it.
        result = can_book(1380, 1441, 540, False, [(600, 660)])
        self.assertIs(result, False)

    # ---- empty existing, and several bookings (AC4) ----

    def test_empty_existing_is_allowed(self):
        result = can_book(600, 660, 540, False, [])
        self.assertIs(result, True)

    def test_conflict_with_last_of_several_bookings_is_rejected(self):
        # AC4: only the LAST booking (800, 860) overlaps the request
        existing = [(600, 660), (700, 760), (800, 860)]
        result = can_book(830, 890, 540, False, existing)
        self.assertIs(result, False)

    def test_fits_in_gap_touching_both_neighbours_is_allowed(self):
        # AC4: (660, 700) touches (600, 660) and (700, 760)
        existing = [(600, 660), (700, 760)]
        result = can_book(660, 700, 540, False, existing)
        self.assertIs(result, True)

    # ---- other overlap relationships (AC4) ----

    def test_request_inside_existing_is_rejected(self):
        result = can_book(610, 640, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_request_containing_existing_is_rejected(self):
        # 690 - 570 = 120 minutes, so AC2 does not reject it
        result = can_book(570, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_touching_start_is_allowed(self):
        # AC4: request ends exactly when the existing booking starts
        result = can_book(550, 600, 540, False, [(600, 660)])
        self.assertIs(result, True)

    # ---- unchanged input (AC5) ----

    def test_existing_is_not_changed(self):
        # deliberately NOT sorted, so a hidden sort() would be noticed
        existing = [(700, 760), (600, 660)]
        before = list(existing)
        can_book(630, 690, 540, False, existing)
        self.assertEqual(existing, before)

    def test_existing_is_not_changed_on_success(self):
        existing = [(700, 760), (600, 660)]
        before = list(existing)
        can_book(660, 700, 540, False, existing)
        self.assertEqual(existing, before)


if __name__ == "__main__":
    unittest.main()
