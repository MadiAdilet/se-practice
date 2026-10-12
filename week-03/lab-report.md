# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name: Madi Adilet
Student ID: 24B031062
GitHub username: MadiAdilet

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | Claude |
| Exact model name and version | Claude Sonnet 5 |
| Date of the session | 27.09.2026 |
| Diagram renderer used | plantuml.com/plantuml |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)


```
As a Student, I want to view which rooms are available and when, so that I can find a suitable time slot to study. (Priority: High) — Assumption: Availability can be checked at any time before booking.
As a Student, I want to book a free room for a specific time slot, so that I have a guaranteed space to study. (Priority: High) — Assumption: A student can only book one room at a time for a given slot.
As a Student, I want to cancel a booking I made, so that I free up the room if my plans change. (Priority: High) — Assumption: A student can only cancel their own bookings.
As a Student, I want to receive a confirmation when I book or cancel a room, so that I know the action was successful. (Priority: Medium) — Assumption: Confirmation is shown immediately after the action.
As an Administrator, I want to block a room that is out of service, so that students cannot book a room that isn't usable. (Priority: High) — Assumption: Only administrators can block or unblock rooms.
As an Administrator, I want to unblock a room once it is usable again, so that students can resume booking it. (Priority: Medium) — Assumption: Unblocking is a manual action taken by staff.
As an Administrator, I want to review how rooms are being used over a period, so that I can identify underused or overused rooms. (Priority: Medium) — Assumption: Usage data is available for any past date range.
As a Student, I want to be prevented from booking a room that overlaps with an existing booking, so that double-booking never happens. (Priority: High) — Assumption: Overlap is checked automatically at booking time.
```


---

## 3. Story review (Part 2)

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| 1. View availability | Kept, reworded slightly | Clear stakeholder, testable, matches UC-01 | US-01 |
| 2. Book room | Kept | Core function, matches UC-02 | US-02 |
| 3. Cancel booking | Kept | Matches UC-03 | US-03 |
| 4. Receive confirmation | Kept, reworded reason | Original reason implied the student causes confirmation manually; reworded so it is clearly system-triggered, matching UC-06 | US-04 |
| 5. Block room | Merged with story 6 | Block and unblock are one use case (UC-04); two stories for one function was redundant | US-05 |
| 6. Unblock room | Merged into story 5 | Same reason as above | US-05 |
| 7. Review usage | Kept | Matches UC-05 | US-06 |
| 8. Prevented from overlapping booking | Deleted as a separate story | This is a system constraint (R3), not a stakeholder goal — "I want to be prevented from X" is not a real user want. Folded into US-02's assumption instead | — (merged into US-02) |

**Did the assistant invent anything outside the scenario?** No. I checked each story against the out-of-scope list (payments, check-in/QR, maintenance, notifications beyond confirmation, authentication, waiting lists, screens/databases) and none of it appeared.

**How many stories did you end with, and why that number?** 6 — one per use case. This gave a clean one-to-one mapping to the six fixed use cases, with story 8 absorbed as an assumption rather than kept as a redundant seventh story.

---

## 4. Original AI output — acceptance criteria (Part 3)
```
Assumptions:

"Future" means any time strictly after the current moment.
The maximum booking duration must not exceed two hours.
Overlapping bookings for the same room are not allowed.
A blocked room cannot be booked by a student.

US-02 — Book a room

AC1: Given a room is available for the selected time, when the student submits a booking request, then the booking is confirmed.
AC2: Given the selected start time is in the past, when the student submits the booking, then the system displays an error message.
AC3: Given the requested duration exceeds two hours, when the student submits the booking, then the booking is rejected.
AC4: Given the room already has a booking for an overlapping time, when the student submits a new booking, then the system rejects the new booking.

US-03 — Cancel a booking

AC5: Given the student has an existing booking, when they request to cancel it, then the booking is removed from the system.
AC6: Given the booking does not belong to the student, when they attempt to cancel it, then the system denies the request.
AC7: Given the booking has already started, when the student tries to cancel it, then the system does not allow the cancellation.

US-05 — Block or unblock a room

AC8: Given a room is in service, when an administrator blocks it, then the room is marked unavailable for booking.
AC9: Given a room is blocked, when a student attempts to book it, then the booking is rejected.
AC10: Given a room is blocked, when an administrator unblocks it, then the room becomes available again.
```

---


## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| AC2 (start time in the past) | Fine in substance, but grouped with a vague "error message" | Kept the behavior, reworded as a clear reject | AC-02 |
| AC3 (duration exceeds two hours) | Never tests the boundary — a booking of exactly two hours is never checked | Added a boundary case for exactly two hours | AC-01 covers the boundary implicitly; kept AC3's logic as AC-03 |
| AC4 (overlapping booking rejected) | Never settles whether touching bookings (one ending exactly when another starts) count as an overlap | Split into two criteria: one for a real overlap, one for a back-to-back booking that should succeed | AC-04, AC-05 |
| AC7 (cannot cancel a booking that already started) | Invents a business rule not in R1–R4 or the scenario | Removed; replaced with a criterion about cancelling a nonexistent/already-cancelled booking, which is a real edge case the assistant missed entirely | AC-08 |
| AC1, AC5, AC6, AC8, AC9, AC10 | Sound, matched the rules | Kept, renumbered and reworded for consistency | AC-01, AC-06, AC-07, AC-10, AC-12, AC-11 |

**The two open questions.**

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | Back-to-back bookings are a normal real-world case (10:00–12:00 then 12:00–14:00); rejecting them wastes room capacity for no reason. |
| Is exactly two hours allowed under R2? | allowed | R2 says "at most two hours" — "at most" includes the boundary value itself. |

**Which invalid or boundary case did the assistant leave out?** The exact two-hour boundary (a booking of exactly 120 minutes) and the exact-touch boundary (one booking ending exactly when the next starts) were never explicitly tested in the raw output — both are boundary cases the four given rules directly call for, and both were added in my final version.

---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml
left to right direction

actor Student
actor Administrator
actor System

rectangle "Smart Campus Study Room Booking System" {
usecase "View availability" as UC1
usecase "Book room" as UC2
usecase "Cancel booking" as UC3
usecase "Block or unblock room" as UC4
usecase "Review usage" as UC5
usecase "Send confirmation" as UC6
}

Student --> UC1
Student --> UC2
Student --> UC3
Student --> UC5
Administrator --> UC4
Administrator --> UC5
System --> UC6

UC2 ..> UC6 : <<include>>
UC3 ..> UC6 : <<include>>
UC2 ..> UC4 : <<extend>>

@enduml.
```



---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| `actor System` | A third actor invented outside the fixed two-actor scenario — an internal component disguised as an actor | Removed entirely |
| `Student --> UC5` (Review usage) | A student does not review room usage; that is the Administrator's responsibility | Removed |
| `System --> UC6` (Send confirmation) | No person triggers a confirmation directly — the system generates it as a side effect of booking or cancelling | Removed the actor association; kept Send confirmation reachable only via `<<include>>` from Book room and Cancel booking |
| `UC2 ..> UC4 : <<extend>>` | Booking a room does not extend the block/unblock function — the two use cases are unrelated; this relationship is logically invalid | Removed |

**Associations.** The wrong actor–use-case links the assistant drew were `Student → Review usage` and the invented `System → Send confirmation`.

**Did any screen, database or internal component appear as a use case or an actor?** No literal screen or database, but the invented `System` actor functioned as an internal component wrongly modeled as an actor.

---

## 8. Traceability (Part 5)

- Use cases with **no story** behind them: none — every use case (UC-01 through UC-06) has exactly one story.
- Stories with **no use case** they belong to: none.
- Criteria that test **no rule** from section 1: none — AC-01 through AC-05 test R1, R2 and R3 (including both open-question decisions); AC-10 through AC-13 test R4.

**What does the largest gap tell you about the generated requirements?** The largest gap is that UC-01 (View availability) and UC-05 (Review usage) have stories but no acceptance-criteria set, since the task fixes acceptance criteria to three selected stories out of six. This shows that generated requirements without an explicit acceptance-criteria layer simply have no defined, testable behavior yet — the gap is a scoping choice made in this lab, not a hidden defect in the stories themselves.

---

## 9. Checker runs


python tests/check_requirements.py  
PASS   US-1  user-stories.md         no placeholders left
PASS   US-2  user-stories.md         6 stories, IDs US-01…US-06            
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
PASS   US-7  user-stories.md         nothing from the out-of-scope list appears
PASS   AC-1  acceptance-criteria.md  no placeholders left 
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-02, US-03, US-05
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 13 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  4 assumptions listed before the criteria                                                               
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present  
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found                                     
PASS   TR-1  traceability.md         all six use cases have a row                                                
PASS   TR-2  traceability.md         every ID in the table resolves                                              
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
23 PASS · 0 FAIL · 0 ERROR   (23 checks)                                   
Shape is clean. This says nothing about whether the requirements are good.
                                    
                                                                  


python tests/validate_submission.py  
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Madi Adilet
PASS   student.student_id                        24B031062
PASS   student.github                            MadiAdilet
PASS   assistant.tool                            Claude
PASS   assistant.model                           Claude Sonnet 5
PASS   counts.user_stories                       6
PASS   counts.acceptance_criteria_sets           3
PASS   checker                                   23 PASS · 0 FAIL · 0ERROR
NOTE   checker                                   you are claiming a clean run — it will be re-run at your commit, so make sure it is true
PASS   checker.commit                            76dff5a
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        UC-01, UC-05
PASS   traceability.stories_not_traced           []
PASS   review_findings                           3 findings
PASS   review_findings[1]                        US-08 in the raw output duplicated the overlap rule as a sep…
PASS   review_findings[2]                        UC-05 Review usage had no acceptance-criteria set written th…
PASS   review_findings[3]                        The raw diagram connected Student directly to UC-05 Review u…
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
21 PASS · 0 FAIL · 0 ERROR · 1 note
Shape is fine. This says nothing about whether the work is good.

Commit these numbers were produced at (`git rev-parse --short HEAD`):76dff5a

**Every FAIL, one line each: what it is and what you decided to do about it.** None this run.

**Did you run the checks by hand instead of with Python?** No, Python was available and both checkers ran successfully.

---

## 10. Conclusion (150–200 words)

The generated use-case diagram was the part most likely to mislead someone if it had gone unreviewed: it connected an actor directly to Review usage and to Send confirmation, functions that no person actually triggers, and it invented a third actor called System. Without deliberately asking "who triggers this?" for every single association, that would have shipped as-is and confused anyone reading the diagram cold. On the other hand, the assistant was genuinely useful for the acceptance-criteria skeleton — producing ten Given/When/Then blocks from four business rules in seconds, which I then had to correct for two missed boundary cases (the exact two-hour limit and back-to-back bookings) and one invented rule (AC7) that was never part of the scenario. If I were handing these requirements to an implementer and would not be in the room, I would rewrite UC-05's coverage first: it has a story (US-06) but zero acceptance criteria, and "review how rooms are used" is vague enough that an implementer could build entirely the wrong report without ever finding out until after delivery.



