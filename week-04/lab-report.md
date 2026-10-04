# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Madi Adilet |
| Group | Mon 16-19 |
| AI assistant | Gemini |
| Exact model | Gemini 3.5 Flash-Lite |
| Renderer | PlantUML web server |
| Behaviour diagram | activity |
| Stories used | the reference set from README §3 |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** seven points: actors outside the "Smart Campus System" boundary; goals taken from the scenario; `Validate Booking Details` included in Book a Room (R1-R3); `Send Confirmation` included in Book a Room (R4); R1-R4 shown in a note; a student cancels only their own bookings. It did not decide whether touching bookings overlap, nor what happens to existing bookings when a room is blocked.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `Validate Booking Details` (+ its `<<include>>` from Book a Room) | A system action, not a goal of any actor. The checks are what Book a Room does internally. No story asks for "validate". | R1, R2, R3; US-01 | Removed the use case and the include. The rules are listed in a note on Book Room. |
| 2 | `Send Confirmation` (+ its `<<include>>` from Book a Room) | Confirmation is the outcome of a successful booking, not something a student sets out to do. | R4; US-01 ("I get a confirmation when the booking succeeds") | Removed the use case and the include. R4 stays in the note as the outcome of Book Room. |
| 3 | Both `<<include>>` lines | The only comment above them was a description (`' Include relationship: ...`), not `' why: <reason>`. | README §4 convention | No include remains in the revision, so no `' why:` is needed. |
| 4 | `Block/Unblock Room` (one use case, linked to Administrator) | Two different goals merged into one. The stories separate them. | US-04 (block), US-05 (unblock) | Split into `Block Room` and `Unblock Room`, both linked to Administrator. |
| 5 | Note: R4 listed under "Constraints enforced during validation" | R4 is not a validation constraint, it is the result of a successful booking. | R4 | The note now says "Outcome: R4 successful booking produces a confirmation". |
| 6 | `note bottom of student` ("can only cancel their own bookings") and use case `Cancel Booking` | The ownership restriction is attached to the actor, but it belongs to the goal. The name does not say it. | Scenario ("cancel their own bookings"); US-03 | Renamed to `Cancel Own Booking`, note attached to that use case. |
| 7 | Assumptions | The AI declared nothing about touching bookings or about blocking a room that already has bookings. | Scenario open questions (README §3); R2, R3 | Declared A1 (touching bookings do not overlap) and A2 (blocking keeps existing bookings, it only stops new ones) in a note in the diagram. |


---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one student makes 0..* bookings | each booking belongs to exactly 1 student | 1 / 0..* |
| Room — Booking | one room is reserved by 0..* bookings | each booking is for exactly 1 room | 1 / 0..* |
| Booking — Confirmation | one booking produces exactly 1 confirmation | each confirmation belongs to exactly 1 booking | 1 / 1 |

### 4.2 Constraints the multiplicities cannot show

- R2: a note on `Booking` says two ACTIVE bookings of the same Room must not overlap. Multiplicity 0..* only says a room can have many bookings, not that their time ranges are disjoint.
- R1 (future start, 0 < duration <= 2 hours) and R3 (blocked room accepts no new booking) are in the same note on `Booking`. They are conditions on attributes (`startTime`, `endTime`, `Room.isBlocked`), not on counts.

### 4.3 Assumptions

- A1: touching bookings (one ends 12:00, the next starts 12:00) do NOT overlap, so R2 treats a booking as a half-open interval.
- A2: blocking a room keeps its existing bookings; R3 only stops new ones. Nothing is cancelled automatically.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | `Administrator` class and `Administrator "*" -- "*" Room : manages / blocks` | No rule or story assigns administrators to rooms. Any administrator can block any room, so a many-to-many link records nothing. The class holds only an id and a name and its operations (`blockRoom`, `reviewUsage`) are use-case verbs. | US-04, US-05, US-06; scenario | Removed the class and the association. Blocking is `Room.block()` / `Room.unblock()`. |
| 2 | `Student.viewAvailability()`, `bookRoom()`, `cancelBooking()` | Operations on the actor are use-case goals, not behaviour of a domain object. The booking logic belongs to `Room` and `Booking`. | US-01, US-02, US-03 | Removed all operations from `Student`. Kept `Booking.cancel()` and `Room.isAvailable()`. |
| 3 | `Booking.validateConstraints(): Boolean` | A booking cannot check R2 against other bookings of its room, and R1/R3 are checks done before the booking exists. This is a service responsibility, not domain state. | R1, R2, R3 | Removed. The rules are in a note on `Booking` and shown in the behaviour diagram. |
| 4 | R2 | The AI mentioned R2 only in its assumptions text. Nothing in the diagram stated it. | R2 | Added a note on `Booking` with R1, R2 and R3. |
| 5 | `Booking --> BookingStatus : has >` without multiplicities, next to the attribute `status: BookingStatus` | The same fact drawn twice, and one end has no multiplicity. | README §4 (every association needs multiplicities) | Removed the association. The enum stays as the type of `status` (ACTIVE / CANCELLED), needed for R2 ("active bookings") and US-03. |
| 6 | `Student "1" -- "*" Booking` and `Room "1" -- "*" Booking` | `*` is correct, but `0..*` is the notation used in the review questions. | Review question "read every association both ways" | Changed both to `0..*`. Reads: one student makes 0..* bookings, each booking belongs to exactly 1 student. |
| 7 | Attributes `Student.email`, `Room.location`, `Confirmation.details` | Not needed by R1-R4 or any story. | R1-R4, US-01..US-06 | Removed. |
| 8 | Declared assumptions | The AI declared nothing about touching bookings or about blocking a room that has bookings. | R2, R3 | Declared A1 and A2 in a note on `Room`. |

Kept from the AI: `Confirmation` as a domain concept (R4 says a successful booking produces a confirmation, and `1 / 1` is right because a Booking exists only after success) and `BookingStatus`.

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3B activity, because the three rule checks R1, R3, R2 are sequential decisions with a visible rejection reason, and an activity diagram shows exactly that.

**Design components added beyond the domain model:** none (activity diagram).

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Guards `then [no]` / `else [yes]` on all three decisions | Written without parentheses. The convention is `then ([no])` / `else ([yes])`; as typed, PlantUML does not read them as guard labels. | README §4 (activity guards) | Rewrote every guard as `([yes])` / `([no])`. |
| 2 | Three `if` blocks nested inside each other's `else` | Correct logic, but the success path is buried three levels deep and hard to read. | R1, R3, R2 order | Flattened to three sequential `if` blocks, each ending in `stop` on failure. Order and logic unchanged: R1, then R3, then R2. |
| 3 | Decision text `Do active bookings for this room overlap?` | Does not say what counts as overlap when a booking ends exactly when another starts. | R2; touching-bookings question (README §3) | Decision reads `Overlaps an ACTIVE booking of this room? (R2)`; assumption A1 added in a note (touching bookings do not overlap). |
| 4 | Missing assumption about blocking | Nothing says what happens to bookings that already exist when a room is blocked. | R3 | Note with A2 (blocking keeps existing bookings, it only stops new ones). |
| 5 | Action names `Create Booking Record`, `Generate Confirmation`, `Display Success & Confirmation Details` | "Booking Record" and "Success" are not names used elsewhere. The class diagram has `Booking` and `Confirmation`. | Consistency with the class diagram, R4 | Renamed to `Create Booking (status ACTIVE)`, `Issue Confirmation (R4)`, `Show confirmation to student`. |
| 6 | What the AI got right | Initial node, one decision per rule (R1, R3, R2), a rejection with its own reason on every failure path, no fork, booking created only after the last check, confirmation after creation. | R1, R2, R3, R4, US-01 | Kept. |


---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | `Booking` has no `studentId` or reference to its Student, so ownership for cancelling (US-03) cannot be verified; proposes `cancel(studentId)`. | `Booking`, association `Student "1" -- "0..*" Booking : makes` | reject | The association is the link: it is undirected, so each Booking belongs to exactly 1 Student and the Student is reachable from the Booking. A `studentId` attribute would be a foreign key copied from the association, an implementation detail in a domain model. |
| 2 | The domain model has no support for usage review (US-06); proposes `Room.getUtilizationRate(start, end)`. | Use case `Review Usage`, classes `Room` and `Booking` | reject | Usage is derived from Booking (startTime, endTime, status) and Room, which are already in the model (§7 row US-06). A utilisation report is a query or report function, not domain state, and no rule requires it. |
| 3 | `Student` has no methods while Room and Booking do; proposes adding `bookRoom()` and `cancelBooking()` to `Student`. | `Student` | reject | This reintroduces the AI's original error (§4.4 finding 2): those operations are use-case goals of the actor, not behaviour of a domain object. Booking logic belongs to `Room` and `Booking`, so a Student without operations is correct. |
| 4 | Booking has no creation method or constructor tying the activity step `Create Booking (status ACTIVE)` to the class model; proposes `Booking.createBooking(...)`. | `Booking`, action `Create Booking (status ACTIVE)` | reject | Constructors are not drawn in a domain class diagram, and a factory taking Room and Student is a design detail. The booking is created only after R1, R3 and R2 pass (activity diagram), and the class `Booking` is that object. |
| 5 | A1, A2 and R1-R3 are repeated in notes in several diagrams; keep the algorithm in the activity diagram and only structural rules in the class note. | Notes in `use-case.puml` and `class.puml` | reject | The repetition is deliberate. README §3 says an assumption is declared the moment a diagram depends on it, A1 and A2 must be the same in all three diagrams (§7), and CL8 needs R2 as a note on `Booking` because multiplicity cannot say it. |

Run history: I sent the critique prompt twice. The first run was a mistake: my `models/use-case.puml` at that time was identical to the AI's original (it had `Validate Booking Details`, `Send Confirmation` and `Block/Unblock Room`), so that run is not counted here. The rows above are the second run, made in a new chat with `approved-stories.md` and my three revised files.

Observation: none of the five issues is a defect in a rule R1-R4. Issues 1, 2 and 4 ask for implementation details (a foreign key, a report function, a constructor), and issue 3 asks me to undo a correction I made in §4.4. I checked each cited element in my revised files before giving a verdict.

---

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room | Booking (startTime, endTime), note on Booking | decision `Start in future and 0 < duration <= 2 h? (R1)` |
| R2 | Book Room | Booking (status, startTime, endTime), Room, note on Booking | decision `Overlaps an ACTIVE booking of this room? (R2)` |
| R3 | Block Room, Unblock Room | Room (isBlocked, block(), unblock()), note on Booking | decision `Room blocked? (R3)` |
| R4 | Book Room | Confirmation, Booking, association `produces` | action `Issue Confirmation (R4)` |
| US-01 | Book Room | Student, Booking, Room, Confirmation | whole activity: three decisions, then `Create Booking (status ACTIVE)` |
| US-02 | View Room Availability | Room, Booking (Room.isAvailable) | not in the activity diagram (it shows Book Room only) |
| US-03 | Cancel Own Booking | Student, Booking (status CANCELLED, cancel()) | not in the activity diagram |
| US-04 | Block Room | Room (isBlocked, block()) | not in the activity diagram; its effect is the R3 decision |
| US-05 | Unblock Room | Room (isBlocked, unblock()) | not in the activity diagram |
| US-06 | Review Usage | Booking, Room (usage is read from bookings) | not in the activity diagram |


---

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Use cases `Validate Booking Details` and `Send Confirmation` with two includes from Book a Room; one `Block/Unblock Room`; `Cancel Booking`. | Both include use cases and their includes removed; split into `Block Room` and `Unblock Room`; `Cancel Own Booking`; R4 stated in the note as an outcome of Book Room. | Validation and confirmation are system actions, not goals (R1-R4, US-01); US-04 and US-05 are separate stories; scenario says students cancel their own bookings. |
| 2 | class | `Administrator` class with `* -- *` to Room; operations on `Student`; `Booking.validateConstraints()`; no R2 note; `*` multiplicities; extra attributes. | Administrator, Student operations and `validateConstraints()` removed; note on Booking with R1, R2, R3; multiplicities `0..*`; A1 and A2 declared. | No story assigns administrators to rooms; operations on the actor are use-case verbs; R2 cannot be a multiplicity. |
| 3 | activity | Guards `then [no]` / `else [yes]`, three nested `if` blocks, action names not matching the class diagram, no assumptions. | Guards `([yes])` / `([no])`, three sequential checks R1, R3, R2, names matching the class diagram, A1 and A2 in a note. | README §4 guard convention; readability; consistency with `Booking` and `Confirmation`; A1 and A2 must be declared. |


---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  4 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 2 assumption(s) declared
LR5  PASS  6 behaviour-diagram findings in §5
LR6  PASS  5 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story

SUMMARY pass=35 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The AI got the class diagram most wrong. It added an Administrator class linked `* -- *` to Room, which says any number of administrators manage any number of rooms, but no story assigns administrators to rooms. It put bookRoom() and cancelBooking() on Student, which are use-case goals, not behaviour of a domain object, and it left R2 out of the diagram. The error that would have reached the code is Booking.validateConstraints(): a booking cannot check R2 against the other bookings of its room, so the overlap check would have been written in the wrong place. In the use-case diagram Validate Booking Details was a goal, although R1-R3 are checks inside Book Room. The critique found no defect in R1-R4. Its second run asked me to put bookRoom() back on Student, which I rejected, and its first run cited elements that existed only in the original diagram, because I had sent it the wrong file.
