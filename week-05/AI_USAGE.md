# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Gemini | 3.6 flash | the plan (Task 1) | `lab-report.md` §2 (plan pasted unedited) |
| Gemini | 3.6 flash | the first version, v1 (Task 2) | `code/original/booking_v1.py`, copied to `code/booking.py` |
| Gemini | 3.6 flash | the critique, Prompt 4 (Task 5) | `lab-report.md` §6 (critique pasted) |
| Claude | Claude Sonnet 5.5 | read v1 against AC1-AC5 and drafted the AC map; wrote the test file (18 of the 19 tests); drafted the report tables and texts for §2 (review table), §3, §4, §5, §6 (verdict rows), §7, §9.2 and §9.3; checked the wording and the length of §10 and gave feedback on my drafts | `code/test_booking.py`, `lab-report.md` §2-§7, §9 |

**The assistant wrote, or helped write, my tests in `code/`:** yes

Claude wrote the file `code/test_booking.py` with 18 tests. The 19th test
(`test_start_equal_to_now_at_end_of_day_is_rejected`) was added later as the extra edge case for §5.
I read every test and checked its expected value against AC1-AC5 by hand, using the AC text and
not the output of `can_book`. Then I ran the suite on v1 and the checker, which confirmed all
ten M checks.

**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:** nothing.

**Other things to know about how I worked:**

- Several parts of `lab-report.md` (the review table in §2, the AC map in §3, the test table in §4,
  the row in §5, the verdict rows in §6, the row in §7, and the texts of §9.2 and §9.3) were drafted by
  Claude and I pasted them in. I checked them against the code and the AC, but the wording is
  Claude's, not mine. For §9.3 Claude also explained the reasoning.
- §10 (the conclusion) is my own text. Claude gave feedback on facts and length only and I rewrote
  it after that.
- My first attempt at Prompt 1 went to the assistant without the specification block, so it
  answered for a generic booking system. I discarded that plan and repeated Prompt 1 in a new chat
  after the specification was sent. The plan in §2 is from the second attempt.
- Prompt 4 was sent with an extra heading line and the prompt text pasted twice. The wording of the
  prompt itself was not changed. The critique in §6 is pasted without the repeated "Final Code"
  section the assistant printed under it. No critique point was removed or edited.

Signed: Madi Adilet
Date: 11.10.2026