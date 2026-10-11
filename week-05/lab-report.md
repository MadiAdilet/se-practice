# Week 05 — Lab report

**Name:**Madi Adilet
**Group:**Monday 16-19
**Date:**11.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Gemini|
| **Exact** model name | 3.6 flash |
| Language and version |Python 3.14.8 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
Implementation Plan for can_book
Order of Checks

To evaluate whether a booking request is valid according to the acceptance criteria (AC1–AC4), the function will perform the following checks sequentially and return False as soon as any check fails:

    Blocked Room Check (AC3):

        Check if blocked is True. If True, return False immediately.

    Time Range & Progression Check (AC1):

        Check if start and end satisfy 0≤start<end≤1440.

        Check if start>now.

        If any condition fails, return False.

    Duration Check (AC2):

        Calculate duration=end−start.

        Check if duration≤120. If false, return False.

    Overlap Check (AC4):

        Iterate through each (b_start, b_end) tuple in existing.

        Since intervals are half-open [start,end), two intervals [s1​,e1​) and [s2​,e2​) overlap if and only if max(s1​,s2​)<min(e1​,e2​).

        Alternatively, check if the requested interval is strictly before or strictly after the existing booking: end≤b_start or start≥b_end. If neither condition holds, there is an overlap.

        Return False on the first detected overlap.

    Decision (AC5):

        If all checks pass, return True.

Key Assumptions

    Data Types: start, end, and now are integers representing minutes after midnight. blocked is a boolean. existing is an iterable (e.g., list or set) of 2-tuples containing integer bounds (b_start, b_end).

    Pre-validated Input Bounds: now is guaranteed to be in [0,1439] as per the contract. Existing bookings in existing are pre-validated valid tuples for the current room.

    Side-Effect Safety: The function strictly reads inputs without mutating existing or any other passed argument.

    Single-Day Boundary: Midnight corresponds to minute 0; the maximum end bound is minute 1440 (24:00).

Suggested Boundary Cases

To thoroughly test the implementation against edge cases, consider the following test scenarios:

    AC1 Boundaries (Time & Now):

        start=now: Edge case for strict inequality (start>now). Must return False.

        start=now+1: Minimal valid future start time.

        start=0, end=120 with now=0: Must return False (since 0≯0).

        end=1440: Upper bound limit. Should pass if duration and time checks hold.

        end=1441: Exceeds upper limit. Must return False.

        start=end: Zero duration. Must return False.

    AC2 Boundaries (Duration):

        end−start=120: Maximum allowed duration boundary. Must return True.

        end−start=121: One minute over limit. Must return False.

    AC3 Boundaries (Blocked Room):

        blocked = True with otherwise fully valid inputs. Must return False.

    AC4 Boundaries (Endpoint Touching & Overlap):

        Touching Endpoints (Allowed): Requested [600,660) with existing [540,600) (start=b_end) or existing [660,720) (end=b_start). Must return True.

        Partial Overlap: Requested [600,660) with existing [570,630). Must return False.

        Enclosure / Sub-interval: Requested [600,660) with existing [610,650) or existing [590,670). Must return False.

        Empty existing list: existing = []. Should handle gracefully and return True.
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Checks 1-5 (blocked, AC1 range and start > now, AC2 duration, AC4 overlap, final True) | AC3, AC1, AC2, AC4, AC5: the same four conditions, no extra rule | Compared every step with AC1-AC5; nothing invented, nothing to drop |
| 2 | Order of checks: blocked first, then AC1, AC2, AC4 | The spec lists AC1-AC4 in a different order but does not require any order; AC5 makes them a conjunction | Kept: the order does not change the result |
| 3 | "strictly before or strictly after" the existing booking | AC4: touching endpoints are allowed, so the comparison is end <= b_start or start >= b_end, not strict | Kept the formula (correct), noted the wording as imprecise |

**Boundary cases the assistant suggested that I kept as tests:**

- start = now (must be False) and start = now + 1
- end = 1440 and end = 1441
- start = end (zero length)
- duration 120 (True) and 121 (False)
- blocked = True with otherwise valid input
- touching on both sides: existing [540,600) and [660,720) against [600,660) (True)
- partial overlap, request inside the existing booking, request containing it (False)
- empty existing
---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if blocked: return False` | AC3 (the room is not blocked) | Yes. A blocked room returns False whatever the other inputs are, which is what AC3 and AC5 ask for. |
| 2 | `if not (0 <= start < end <= 1440 and start > now): return False` | AC1 (0 <= start < end <= 1440, and start > now) | Yes. It is the AC1 text word for word. `start == now` gives `start > now` False, so it is rejected; `end == 1440` is allowed; `start == end` and `start > end` fail `start < end`. |
| 3 | `if (end - start) > 120: return False` | AC2 (duration at most 120) | Yes. Duration 120 gives `120 > 120` False, so it is allowed; 121 is rejected. |
| 4 | `if b_start < end and start < b_end: return False` (inside `for b_start, b_end in existing`) | AC4 (no overlap, touching allowed) | Yes. Overlap needs both strict inequalities. Request (660, 720) vs (600, 660): `600 < 720` True, `660 < 660` False, so no overlap (touching allowed). Request (630, 690) vs (600, 660): `600 < 690` and `630 < 660` both True, overlap. Containing (570, 690) and inside (615, 645) vs (600, 660) are also both True, overlap. |
| 5 | `return True` (last line) | AC5 (True only when AC1-AC4 hold) | Yes. It is reached only if no earlier check returned False. The results are the literals `True` and `False`, so the type is bool. The loop only reads `existing`, so the list is not changed. |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- Nothing found. I looked for a gap between bookings, sorting or storing `existing`, type checks, exceptions, logging and a non-bool return. None of them are in the code. The docstring mentions `existing` as an "iterable", while the contract speaks of tuples; that does not change the behaviour.
- What I expected to fail: by reading, nothing. I expected v1 to satisfy AC1-AC5. Not verified against non-integer times (`600.5`, `"600"`), because the contract does not cover them; this goes to §9.2.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | none | True | AC4 | pass | pass |
| 2 | test_overlap_is_rejected | (630, 690) | none | False | AC4 | pass | pass |
| 3 | test_blocked_room_is_rejected | (660, 720) | blocked=True | False | AC3 | pass | pass |
| 4 | test_exactly_two_hours_is_allowed | (720, 840) | none | True | AC2 | pass | pass |
| 5 | test_over_two_hours_is_rejected | (720, 841) | none | False | AC2 | pass | pass |
| 6 | test_start_equal_to_now_is_rejected | (540, 570) | none | False | AC1 | pass | pass |
| 7 | test_zero_length_is_rejected | (700, 700) | none | False | AC1 | pass | pass |
| 8 | test_reversed_times_are_rejected | (760, 700) | none | False | AC1 | pass | pass |
| 9 | test_end_of_day_1440_is_allowed | (1380, 1440) | none | True | AC1 | pass | pass |
| 10 | test_end_after_1440_is_rejected | (1380, 1441) | none | False | AC1 | pass | pass |
| 11 | test_empty_existing_is_allowed | (600, 660) | existing=[] | True | AC4 | pass | pass |
| 12 | test_conflict_with_last_of_several_bookings_is_rejected | (830, 890) | existing=[(600,660),(700,760),(800,860)] | False | AC4 | pass | pass |
| 13 | test_fits_in_gap_touching_both_neighbours_is_allowed | (660, 700) | existing=[(600,660),(700,760)] | True | AC4 | pass | pass |
| 14 | test_request_inside_existing_is_rejected | (610, 640) | none | False | AC4 | pass | pass |
| 15 | test_request_containing_existing_is_rejected | (570, 690) | none | False | AC4 | pass | pass |
| 16 | test_touching_start_is_allowed | (550, 600) | none | True | AC4 | pass | pass |
| 17 | test_existing_is_not_changed | (630, 690) | existing=[(700,760),(600,660)] (unsorted) | False, list unchanged | AC5 | pass | pass |
| 18 | test_existing_is_not_changed_on_success | (660, 700) | existing=[(700,760),(600,660)] (unsorted) | True, list unchanged | AC5 | pass | pass |
| 19 | test_start_equal_to_now_at_end_of_day_is_rejected | (1439, 1440) | now=1439, existing=[] | False | AC1 | pass | pass |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(1439, 1440, 1439, False, [])` | `False` (AC1: start must be > now, 1439 is not > 1439) | `False` | `if not (0 <= start < end <= 1440 and start > now): return False` already rejects it; no defect | none | me: an extra edge case added after v1 passed all tests and F1-F10 |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
Critique of Implementation

The provided implementation was evaluated strictly against the Function Contract and Acceptance Criteria (AC1–AC5). Here are the potential issues identified:

    Type/Structure Safety on Unpacking existing

        Quoted Line: for b_start, b_end in existing:

        Criterion / Contract Line: Contract line: existing contains valid (start, end) tuples for this room's active bookings only.

        Issue: While the contract guarantees elements are valid (start, end) tuples, if existing is an iterator/generator that gets consumed during execution, or if an unexpected data structure is passed, iterating directly without explicit defensive type checks could cause runtime errors or prevent re-use if passed downstream, though it adheres strictly to expected inputs.

    Implicit Reliance on Python Truthiness for blocked

        Quoted Line: if blocked:

        Criterion / Contract Line: AC3: The room is not blocked. & Contract line: blocked is a Boolean.

        Issue: Evaluates truthiness rather than strictly verifying blocked is True. If non-boolean truthy values (e.g., non-empty strings or integers) are passed, it treats them as blocked without explicit boolean validation.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Add defensive checks for `for b_start, b_end in existing:` (iterator consumed, unexpected structure) | reject | Contract: "existing contains valid (start, end) tuples for this room's active bookings only", so an unexpected structure is outside the contract. The critique itself says the code "adheres strictly to expected inputs". No AC asks for type checks; AC5 only asks for True or False and that `existing` is not altered, and the loop only reads it. | no change, 19 tests OK |
| 2 | Verify `blocked is True` instead of `if blocked:` | reject | Contract: "blocked is a Boolean". For a real bool `if blocked` and `blocked is True` give the same result; they differ only for non-bool values, which the contract excludes. AC3 is covered by `test_blocked_room_is_rejected` and checker F5. | no change, 19 tests OK |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No change to `code/booking.py` (identical to `code/original/booking_v1.py`) | Both critique points were rejected (see §6); v1 satisfies AC1-AC5 | `python tests/check_booking.py`: F1-F10 PASS on v1, M1-M10 PASS on my suite |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_conflict_with_last_of_several_bookings_is_rejected (test_booking.BookingTests.test_conflict_with_last_of_several_bookings_is_rejected) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests.test_empty_existing_is_allowed) ... ok
test_end_after_1440_is_rejected (test_booking.BookingTests.test_end_after_1440_is_rejected) ... ok
test_end_of_day_1440_is_allowed (test_booking.BookingTests.test_end_of_day_1440_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_is_not_changed (test_booking.BookingTests.test_existing_is_not_changed) ... ok
test_existing_is_not_changed_on_success (test_booking.BookingTests.test_existing_is_not_changed_on_success) ... ok
test_fits_in_gap_touching_both_neighbours_is_allowed (test_booking.BookingTests.test_fits_in_gap_touching_both_neighbours_is_allowed) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_request_containing_existing_is_rejected (test_booking.BookingTests.test_request_containing_existing_is_rejected) ... ok
test_request_inside_existing_is_rejected (test_booking.BookingTests.test_request_inside_existing_is_rejected) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected) ... ok
test_start_equal_to_now_at_end_of_day_is_rejected (test_booking.BookingTests.test_start_equal_to_now_at_end_of_day_is_rejected) ... ok
test_start_equal_to_now_is_rejected (test_booking.BookingTests.test_start_equal_to_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 19 tests in 0.002s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text

Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (36 lines)
PASS   S1   your suite has at least 11 tests            19 tests
PASS   S2   your suite is green on your own code        19 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_start_equal_to_now_at_end_of_day_is_rejected, test_start_equal_to_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_1440_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_fits_in_gap_touching_both_neighbours_is_allowed, test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_conflict_with_last_of_several_bookings_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_request_containing_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_is_not_changed_on_success
PASS   M10  your tests catch a fault in AC5             caught by test_existing_is_not_changed, test_existing_is_not_changed_on_success
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 3 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              5 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  19 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 2 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      172 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.

```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | the final run is clean |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- `can_book(600.5, 660, 540, False, [])` returns `True`: the comparisons and the subtraction work on floats, so 600.5 is treated as a start time and no check rejects it. `can_book('600', 660, 540, False, [])` raises `TypeError` at the line `if not (0 <= start < end <= 1440 and start > now):`, because an int cannot be compared with a str. My function has no code for non-integer times, so I declare `not-handled`. I think this is the right call: the contract says times are integer minutes, and AC5 only asks for True or False for inputs the contract allows. Adding type checks would be a rule no AC asks for, the same kind of suggestion I rejected in §6, point 1. The cost is that a caller who passes a float can get `True` for a time that is not a whole minute, so the caller has to pass integers.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- The bound `0 <= start` can never be the only reason a request is rejected. The contract gives `now >= 0`, so any `start < 0` also fails `start > now` (for example `start = -10`, `now = 0`: `-10 > 0` is false). The request is already rejected by `start > now`, so `0 <= start` never decides alone.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
The overlap condition is b_start < end and start < b_end. An overlap occurs only when both conditions are true, meaning each interval begins before the other finishes. For example, comparing (660, 720) against an existing booking (600, 660) results in 600 < 720 being true, but the second comparison 660 < 660 is false. Because strict inequality < is used, touching is allowed by AC4.

During testing, the v1 implementation was correct; however, with a single test case, 9 out of 10 faulty versions survived. Faulty versions survived because my first test checked only one happy case. The tests I added (for example zero duration start == end and room blocked) each check one rule with an input that only that rule rejects.

I made two specific decisions: I decided not to type-check non-integers like 600.5 or "600" because the contract assumes integer types and AC5 covers valid inputs. I rejected the first critique point because the contract says existing contains valid tuples, and the second because the contract says blocked is a Boolean.
