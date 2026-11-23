# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Gemini Web App | not displayed | post-baseline alternative section 2 draft (B0), not used in section 2 | `report.md` | this SIS |
| Claude Web UI | Claude Sonnet 3.5 | plan, Python v1 generation, and critique (B1–B3) | `report.md`, `code/original/booking_v1.py` | this SIS |
| Bolt.new | not displayed | web prototype v1 (stage B) | `web/original/` | this SIS |
| Claude Web UI | Claude Sonnet 5.5 | baseline review (B0b) | `report.md` | this SIS |
| Bolt.new / Claude Web UI | Claude Sonnet 3.5 | page repair response (B4) | `report.md` | this SIS |
| Copilot SDK in VS Code | not displayed | Python test coverage review and additions; Python v1 path correction; frontend cleanup and validation | `code/test_booking.py`, `code/original/booking_v1.py`, `web/final/project/src/App.tsx`, `report.md`, `submission.yml`, `AI_USAGE.md` | this SIS |
| Playwright with local Microsoft Edge | 1.64.1 | browser testing of page cases and capture of unedited screenshots | `report.md`, `evidence/before-1.png`, `evidence/after-1.png`, `evidence/final-narrow.png` | this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes. I added tests for a zero-length interval (AC1), a request containing an existing booking (AC4), and unchanged unsorted inputs (AC5). Their expected values come from the stated contract, not from running the implementation.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes. The Python v1 body matches B2; it was placed at the required `booking_v1.py` path without changing its code. The original web export was not edited in this session.

**Every result in report.md section 5 was actually run or seen, not assumed:** yes. The assistant executed the Python cases and ran page cases T1–T7, T10–T12 in a local Edge browser. T8/T9 were attempted, but the time input rejected 24:00/24:01, so both are recorded as Not testable. The student reviewed the reported results and screenshots but did not personally run the tests or browser checks.

**Everything I submitted, I can explain and defend in class — including the overlap condition
and what the agent did in section 9:** the student confirms reviewing the final code and this disclosure before submission.

**Anything I accepted from the AI without fully understanding it:** The student has not yet reviewed this session's frontend changes. Review `web/final/project/src/App.tsx` before accepting the changes.

Signed: Madi Adilet
Date: 2026-11-07
