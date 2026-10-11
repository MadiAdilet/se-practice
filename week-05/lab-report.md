# Week 05 — Lab report

**Name:**Madi Adilet
**Group:**Monday 16-19
**Date:**10.210.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | Gemini|
| **Exact** model name | 3.6 flash |
| Language and version |Python 3.14.8 |
| Path | A / B |
| My Week 04 declaration for touching bookings | allowed / not-allowed / did not submit |

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

-
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
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
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
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

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
