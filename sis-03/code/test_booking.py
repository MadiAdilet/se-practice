import unittest
from booking import can_book

NOW = 540
BLOCKED = False
EXISTING = [(600, 660)]


class TestBooking(unittest.TestCase):

    def test_t1_touching(self):
        # 660-720 touching existing (600,660) at endpoint -> Available
        self.assertTrue(can_book(660, 720, NOW, BLOCKED, EXISTING))

    def test_t2_overlap(self):
        # 630-690 overlaps with (600,660) -> Unavailable
        self.assertFalse(can_book(630, 690, NOW, BLOCKED, EXISTING))

    def test_t3_blocked(self):
        # Room is blocked -> Unavailable
        self.assertFalse(can_book(660, 720, NOW, True, EXISTING))

    def test_t4_exactly_120(self):
        # Duration exactly 120 minutes -> Available
        self.assertTrue(can_book(720, 840, NOW, BLOCKED, EXISTING))

    def test_t5_121_min(self):
        # Duration 121 minutes -> Unavailable
        self.assertFalse(can_book(720, 841, NOW, BLOCKED, EXISTING))

    def test_t6_starts_now(self):
        # start == now (540) is not strictly after now -> Unavailable
        self.assertFalse(can_book(540, 570, NOW, BLOCKED, EXISTING))

    def test_t7_reversed(self):
        # start > end -> Invalid range -> Unavailable
        self.assertFalse(can_book(720, 660, NOW, BLOCKED, EXISTING))

    def test_t8_ends_at_midnight(self):
        # 1380-1440 -> Available
        self.assertTrue(can_book(1380, 1440, NOW, BLOCKED, EXISTING))

    def test_t9_past_midnight(self):
        # end > 1440 -> Unavailable
        self.assertFalse(can_book(1380, 1441, NOW, BLOCKED, EXISTING))

    def test_t10_second_booking(self):
        # Overlaps with second booking (700-760) -> Unavailable
        existing_two = [(600, 660), (700, 760)]
        self.assertFalse(can_book(720, 780, NOW, BLOCKED, existing_two))

    def test_t11_same_check_twice_and_no_mutation(self):
        # Pure function evaluation check and AC5 immutability check
        original_existing = [(600, 660)]
        existing_copy = list(original_existing)

        res1 = can_book(660, 720, NOW, BLOCKED, existing_copy)
        res2 = can_book(660, 720, NOW, BLOCKED, existing_copy)

        self.assertTrue(res1)
        self.assertTrue(res2)

        # AC5: Verify that calling can_book did not mutate the input existing list
        self.assertEqual(existing_copy, original_existing)

    def test_zero_length_interval(self):
        self.assertFalse(can_book(700, 700, NOW, BLOCKED, EXISTING))

    def test_request_containing_existing_booking(self):
        self.assertFalse(can_book(570, 690, NOW, BLOCKED, EXISTING))

    def test_unsorted_bookings_remain_unchanged(self):
        existing = [(900, 960), (600, 660)]
        original_existing = list(existing)

        self.assertTrue(can_book(780, 840, NOW, BLOCKED, existing))
        self.assertEqual(existing, original_existing)


if __name__ == '__main__':
    unittest.main()