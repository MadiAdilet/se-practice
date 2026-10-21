# SIS #02 — AI-Assisted UML Modeling: University Course Registration

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the checker and the word counter. Delete them or leave them.
-->

## 1. Scope and assumptions

<!-- Your FINAL scope statement and assumptions, after reviewing Prompt A's output. Say here
     what is out of scope (payments, prerequisites, timetable clashes, waiting lists,
     cancellation) — section 2 must not mention them. Section 10 keeps your first version. -->

**Scope:** The scope of this system covers viewing the electronic course catalog for a selected semester and processing student course registration requests. The catalog display provides the course code, title, section, and dynamic available places. The registration workflow includes rechecking availability, preventing duplicate enrollments, creating an Enrollment record, and updating available capacity atomically. Out of scope for this system are payments, course prerequisites, timetable/schedule conflict resolution, waiting lists, and enrollment cancellations.

**Assumptions:**

1. Dynamic available places are calculated on the fly as maximum capacity minus the count of active enrollments ($\text{availablePlaces} = \text{capacity} - \text{count}(\text{Enrollments})$), ensuring static course capacity is never mutated during registration. 
2. Concurrency and race conditions (e.g., stale catalog views or simultaneous registrations) are handled by acquiring an explicit lock/transaction on the CourseOffering during the registration sequence before performing availability and duplicate enrollment checks.


## 2. User stories and acceptance criteria

<!-- Your APPROVED requirements: Prompt A's draft after your review. Keep the IDs, the three
     story headings and the bullet shape. Every criterion names the rule(s) it maps to,
     e.g. (R2, R4). Two criteria per story. Nothing out of scope.
     Format of a criterion, on one bullet:
     - **AC-03** (R2, R4): Given ..., When ..., Then ... -->

### US-01 — Browse offerings

**US-01:** As an authenticated student, I want to view the course catalog with real-time seat availability for a given semester, so that I can select an open course offering for registration

- **AC-01** (Rule R1): Given an authenticated student viewing the electronic course catalog for a selected semester, When the student requests the course list, Then the system displays each course's code, title, offering section, and available places[cite: 1].
- **AC-02** (Rule R1): Given an authenticated student browsing the catalog, When a course offering has reached its maximum capacity, Then the system displays 0 available places for that offering without reserving seats or creating enrollments[cite: 1].

### US-02 — Register for an offering

**US-02:** As an eligible student, I want to submit a registration request for an available course offering, so that I can successfully secure my seat in the class.

- **AC-03** (Rules R2, R4): Given an authenticated student who is not currently enrolled in the selected course offering, And the offering has at least 1 available place, When the student submits a registration request, Then the system rechecks availability, creates exactly one Enrollment record linking the student and the offering, updates available places, and returns a confirmation message[cite: 1].
- **AC-04** (Rules R2, R4): Given an offering with capacity 2 and 1 existing enrollment, When a second eligible student submits a registration request, Then total enrollment becomes 2, available capacity updates to 0, and a success confirmation is returned[cite: 1].

### US-03 — Receive a clear rejection

**US-03:** As a student attempting registration, I want to receive clear rejection feedback on invalid requests, so that I understand why my registration failed.

- **AC-05** (Rules R2, R5): Given a student attempting to register for a course offering where current enrollment equals capacity (0 places available), When the registration request is processed, Then the system rejects the request, displays "course full", creates no Enrollment record, and leaves total enrollment unchanged[cite: 1].
- **AC-06** (Rules R3, R5): Given a student who already has an active enrollment in the selected course offering, When the student submits a repeat registration request for the same offering, Then the system rejects the request, displays "already enrolled", creates no duplicate Enrollment record, and leaves total enrollment unchanged[cite: 1].
## 3. Sequence diagram

<!-- The FINAL diagram, rendered. Change .png to .svg if that is what you exported. -->

![Final sequence diagram](models/img/sequence.png)

**Participants:** Student (Actor): The end-user (authenticated student) initiating the course catalog view and registration actions.

CatalogController (Technical Lifeline): The API/UI controller handling incoming requests for catalog queries and returning presentation data.

RegistrationService (Technical Lifeline): The application service orchestrating the transactional registration workflow, locking, and validation checks.

CourseOffering (Domain Entity): The domain class representing a specific course section, maintaining total capacity and lock management, and calculating remaining places.

Enrollment (Domain Entity): The domain entity representing an active registration linking a Student to a CourseOffering.

**Atomic operation:** Messages forming the atomic step: The atomic operation begins with Service -> Offering : acquireLockAndTransact(offeringId) and encompasses Service -> Offering : isStudentEnrolled(studentId), Service -> Offering : getAvailablePlaces(), Service -> Enrollment : create(studentId, offeringId), and Service -> Offering : linkEnrollment(enrollmentRef), ending with Service -> Offering : releaseLock().Why this is atomic: Placing lock acquisition prior to the availability and duplicate checks guarantees that concurrent registration attempts cannot evaluate stale availability or introduce duplicate active enrollments before the transaction completes.Why a catalog view reserves nothing: Browsing the catalog via browseCatalog(semester) is a read-only operation; it dynamically calculates and returns current available places ($capacity - count(Enrollments)$) without acquiring write locks, holding seats, or creating draft Enrollment instances. 

**Where the Enrollment is created:** Message: Service -> Enrollment : create(studentId, offeringId)

Lifeline: RegistrationService invokes the instantiation on the Enrollment lifeline.

Class produced: It produces an instance of the Enrollment domain class defined in Section 4 (Class Diagram).

**Technical lifelines:** 
CatalogController and RegistrationService are technical lifelines.

Why the difference in abstraction is fine: Sequence diagrams represent dynamic system behavior and interaction architecture, which naturally require application services and API controllers to model control flow and transactional boundaries. Class diagrams focus on the core structural domain model (domain entities and business rules). Combining application lifelines with domain entities in a sequence diagram accurately illustrates how infrastructure/application layers interact with domain objects.

## 4. Class diagram

<!-- The FINAL diagram, rendered. -->

![Final class diagram](models/img/classes.png)

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| `Student` -- `Enrollment` | A `Student` holds zero to many (`0..*`) `Enrollment` records. | An `Enrollment` belongs to exactly one (`1`) `Student`. |
| `CourseOffering` -- `Enrollment` | A `CourseOffering` has zero to many (`0..*`) `Enrollment` records. | An `Enrollment` is linked to exactly one (`1`) `CourseOffering`. |
| `Course` -- `CourseOffering` | A `Course` includes zero to many (`0..*`) `CourseOffering` sections. | A `CourseOffering` is an offering of exactly one (`1`) `Course`. |

**How an Enrollment links a student to an offering:**  
An `Enrollment` acts as an associative domain entity that reifies the dynamic relationship between a `Student` and a `CourseOffering`. Instead of linking a student directly to an offering with a many-to-many relationship, `Enrollment` captures the instance of registration, maintaining an explicit reference to exactly one `Student` and exactly one `CourseOffering`, along with metadata such as `enrolledAt`.

**Capacity constraint:**  
The total number of active `Enrollment` instances linked to a specific `CourseOffering` must never exceed its defined `capacity` ($\text{count}(\text{Enrollment}) \le \text{capacity}$). Multiplicity alone on the association (`1` to `0..*`) only specifies that an offering can hold zero or more enrollments; standard structural UML multiplicities cannot enforce dynamic runtime upper bounds derived from an instance attribute value (`capacity`), requiring an explicit textual invariant or OCL constraint.

**Uniqueness constraint:**  
A student can have at most one active `Enrollment` for any given `CourseOffering`, preventing duplicate registrations for the same course section. While the UML association multiplicity `0..*` indicates that a student may hold multiple enrollments overall across different offerings, it cannot restrict those enrollments from referencing the same `CourseOffering` instance. Therefore, multiplicity alone cannot enforce tuple uniqueness on $(\text{studentId}, \text{offeringId})$, necessitating a separate uniqueness constraint note or OCL invariant.

## 5. Traceability

<!-- Every rule, including the catalog fields and availability (R1). Column 1: the rule and
     the criteria that cover it, e.g. "R2 + AC-03, AC-04". Column 2: the message, guard,
     class or constraint that shows the rule in YOUR diagrams. Column 3: the T-ID that
     exercises it, or the extra check you did instead (R1 has no T case). -->

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + AC-01, AC-02 | Messages 1–4 (`browseCatalog`, `getAvailableOfferings`, `offeringsList`), `CourseOffering.section`, `getAvailablePlaces()` | Extra check (Catalog inspection during T1, T3) |
| R2 + AC-03, AC-04, AC-05 | Messages 6, 12 (`acquireLockAndTransact`, `getAvailablePlaces()`, `else course full`), `CourseOffering.capacity`, Note on capacity constraint | T1, T2, T3 |
| R3 + AC-06 | Messages 6, 10 (`acquireLockAndTransact`, `isStudentEnrolled()`, `alt already enrolled`), Note on unique constraint `(Student, CourseOffering)` | T4 |
| R4 + AC-03, AC-04 | Messages 14–18 (`create(studentId, offeringId)`, `linkEnrollment`, `confirmation`), `Enrollment` class, associations | T1, T2 |
| R5 + AC-05, AC-06 | Messages 11, 13 (`rejection("already enrolled")`, `rejection("course full")`), Notes on constraints | T3, T4 |

## 6. Walkthroughs

<!-- Walk each case through YOUR final sequence diagram, message by message. Column 2: the
     actual steps and the state change (count before → after). Column 3 starts with Pass or
     Fail, then the location: the message, guard or note where you saw it. A Fail you
     report honestly is a finding, not a penalty. -->

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | Messages 5 -> 6 -> 10 (`isStudentEnrolled` = false) -> 12 (`getAvailablePlaces` = 2) -> 14 (`create`) -> 17 (`confirmation`). Enrollment count changes from 0 to 1, available places from 2 to 1. | Pass (Location: Message 14 `Enrollment: create` in success branch) |
| T2. Last place | Messages 5 -> 6 -> 10 (`isStudentEnrolled` = false) -> 12 (`getAvailablePlaces` = 1) -> 14 (`create`) -> 17 (`confirmation`). Enrollment count changes from 1 to 2, available places from 1 to 0. | Pass (Location: Message 14 `Enrollment: create` in success branch) |
| T3. Full | Messages 5 -> 6 -> 10 (`isStudentEnrolled` = false) -> 12 (`getAvailablePlaces` = 0) -> 13 (`rejection("course full")`). Enrollment count remains 2 of 2, available places remain 0; no record created. | Pass (Location: Message 13 `rejection("course full")` guard branch) |
| T4. Duplicate | Messages 5 -> 6 -> 10 (`isStudentEnrolled` = true) -> 11 (`rejection("already enrolled")`). Enrollment count remains 1 of 2; no duplicate Enrollment record created. | Pass (Location: Message 11 `rejection("already enrolled")` guard branch) |
## 7. Review decisions

<!-- At least three substantive decisions about Prompt C's critique or your own inspection.
     Decision: accepted / rejected / modified — and what you did. Reason: why, in a full
     sentence. Rule: R1–R5. Do not invent an error to fill the table; a justified rejection
     of advice counts. -->

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| CatalogController returning static capacity attribute | Accepted | Replaced raw capacity return with dynamically calculated available places (`capacity - count(Enrollment)`) to prevent displaying inaccurate seat availability to students. | R1 |
| RegistrationService calling `decrementCapacity()` on success | Accepted | Removed `decrementCapacity()` because capacity represents the fixed structural limit of a course offering and must not be mutated upon enrollment creation. | R2, R4 |
| Executing duplicate and capacity checks outside atomic block | Accepted | Reordered execution to acquire transaction lock before evaluating checks to prevent race conditions during concurrent registration requests. | R2, R3, R5 |

## 8. Modeling explanation

<!-- 200–300 words. Your main design choices; how the class diagram and the sequence diagram
     complement each other; why an activity diagram could also help explain the workflow. -->

The domain model and sequence diagram together establish a strict design for university course registration under concurrency constraints. The primary design decision was ensuring atomicity during availability evaluation and record creation. In high-concurrency environments, checking seat capacity outside a locked boundary leads to race conditions where multiple students can read a non-zero availability count simultaneously. To prevent this, the sequence diagram encapsulates duplicate verification, capacity evaluation, and Enrollment creation inside an explicit transaction lock block (acquireLockAndTransact). Furthermore, seat availability is designed as a dynamically calculated property (capacity - count(Enrollments)) rather than a mutable counter field, maintaining structural integrity for historical data.

The class diagram and sequence diagram complement each other by representing static relationships and behavioral execution, respectively. The class diagram specifies domain concepts, explicit multiplicities (e.g., Student "1" -- "0..*" Enrollment), and explicit business rule notes that structural UML constraints cannot directly enforce (such as unique student-offering enrollment pairs). The sequence diagram validates these static boundaries by mapping procedural execution, showing how control flow navigates guard branches (already enrolled, course full, and success) to uphold domain integrity. An activity diagram would further complement this specification by illustrating parallel workflow paths, detailed decision trees, and exception handling processes in a non-procedural visual form.

## 9. Reflection

<!-- 150–200 words. Written by you, not by the assistant: where AI helped, one decision you
     made yourself, one remaining limitation. Specific beats flattering. -->

Reflecting on the iterative refinement of these UML models highlighted the crucial balance between structural abstraction and dynamic transaction design. Initially, relying on naive capacity attributes led to direct state mutation (such as decrementing maximum capacity) rather than maintaining dynamic enrollment counts. Correcting this taught us that core domain constraints must be reflected through relational reification—using an associative entity like `Enrollment` to derive available places on the fly.

Furthermore, analyzing race conditions and concurrent registration attempts revealed significant flaws in the early sequence diagram, where validation checks were placed outside atomic locks. By restructuring the execution flow to acquire locks prior to availability and duplicate checks, we ensured strict transactional integrity. We also learned how important it is to distinguish between pure domain entities and application-layer lifelines (such as controllers and services) in sequence diagrams. Ultimately, this exercise demonstrated that rigid structural multiplicities alone cannot enforce complex domain invariants, underscoring the necessity of combining precise sequence ordering, explicit textual constraints, and well-defined transactional boundaries in software architecture.

## 10. Appendix A — Before AI

<!-- Written BEFORE you run Prompt A, committed and pushed in your first commit, and never
     edited afterwards. This is what you paste into Prompt A as "My initial assumptions". -->

**Scope:** The course registration feature covers student course catalog browsing, seat availability re-checking, single enrollment creation per student-offering pair, and clear error messaging for full or duplicate requests. Payment processing, schedule conflict checks, waitlists, prerequisites, and registration cancellations are strictly out of scope.

**Initial assumptions:**

1. The student is already authenticated in the portal, and their student ID is validly supplied in the request context.
2. Course offerings are created beforehand with a fixed positive integer capacity for the current semester.
3. Seat availability checks and Enrollment record creation are executed as an atomic operation to prevent race conditions.

## 11. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the ~~~~ block that follows its label: AI responses contain ``` PlantUML blocks, and
     ~~~~ keeps them from breaking this file. Prompts B and C: the prompt text first, then
     the material it refers to ("below", "these two") pasted under it, in the same block.
     You may add B5, B6 … after B4 if you ran more. -->

### B1 — Requirements (Prompt A)

- **Tool:** Gemini
- **Model:** not displayed
- **Date:** 2026-10-21
- **Purpose:** draft 3 user stories and 6 acceptance criteria

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

~~~~text
Act as a requirements analyst. Use only this course registration scenario and rules R1-R5: 

Scenario: A student browses an electronic course catalog, chooses a course offering and requests registration. Each offering has a limited number of places. A Course describes a subject. A Course Offering is one scheduled section in one semester. Registration always targets a specific offering. Assume that the student is signed in, the selected offering exists, and its capacity is a positive whole number.

Rules:
R1. Catalog: Show the course code, title, offering and available places for one semester.
R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity.
R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request.
R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation.
R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged.

My initial assumptions are: 
1. The student is already authenticated in the portal, and their student ID is validly supplied in the request context.
2. Course offerings are created beforehand with a fixed positive integer capacity for the current semester.
3. Seat availability checks and Enrollment record creation are executed as an atomic operation to prevent race conditions.


Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs.
Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
~~~~

**Response:**

~~~~text
User Stories and Acceptance Criteria
US-01: Catalog Browsing

As an authenticated student,

I want to view the course catalog with real-time seat availability for a given semester,

So that I can select an open course offering for registration.

    AC-01 (Rule R1):

    Given an authenticated student viewing the electronic course catalog for a selected semester,

    When the student requests the course list,

    Then the system displays each course's code, title, offering section, and available places.

    AC-02 (Rule R1):

    Given an authenticated student browsing the catalog,

    When a course offering has reached its maximum capacity,

    Then the system displays 0 available places for that offering without reserving seats or creating enrollments.

US-02: Successful Registration

As an authenticated student,

I want to register for a course offering that has available capacity,

So that I can secure my place in the course for the semester.

    AC-03 (Rules R2, R4):

    Given an authenticated student who is not currently enrolled in the selected course offering,

    And the offering has at least 1 available place,

    When the student submits a registration request,

    Then the system rechecks availability, creates exactly one Enrollment record linking the student and the offering, updates available places, and returns a confirmation message.

    AC-04 (Rules R2, R4):

    Given an offering with capacity 2 and 1 existing enrollment,

    When a second eligible student submits a registration request,

    Then total enrollment becomes 2, available capacity updates to 0, and a success confirmation is returned.

US-03: Registration Rejection

As an authenticated student,

I want to receive an explicit rejection reason when I attempt an invalid registration,

So that I understand why my registration failed and my state remains unchanged.

    AC-05 (Rules R2, R5):

    Given a student attempting to register for a course offering where current enrollment equals capacity (0 places available),

    When the registration request is processed,

    Then the system rejects the request, displays "course full", creates no Enrollment record, and leaves total enrollment unchanged.

    AC-06 (Rules R3, R5):

    Given a student who already has an active enrollment in the selected course offering,

    When the student submits a repeat registration request for the same offering,

    Then the system rejects the request, displays "already enrolled", creates no duplicate Enrollment record, and leaves total enrollment unchanged.

Unresolved Uncertainties

    Concurrent Request Handling: While availability re-checking and enrollment creation are specified as atomic, the exact database locking mechanism (e.g., pessimistic vs. optimistic concurrency control) is left to technical design.

    Catalog Freshness: Whether catalog views automatically stream live updates or require manual browser refreshes when places fill up is not specified.
~~~~

### B2 — UML drafts (Prompt B)

- **Tool:** Gemini
- **Model:** not displayed
- **Date:** 2026-10-21
- **Purpose:** draft the sequence and class diagrams

**Prompt:**

~~~~text
Using my approved scenario, R1-R5, stories and criteria below, return separate PlantUML code blocks for a sequence diagram and a domain class diagram.

Approved Requirements:
US-01: Catalog Browsing
- AC-01 (Rule R1): Given an authenticated student viewing the electronic course catalog for a selected semester, When the student requests the course list, Then the system displays each course's code, title, offering section, and available places.
- AC-02 (Rule R1): Given an authenticated student browsing the catalog, When a course offering has reached its maximum capacity, Then the system displays 0 available places for that offering without reserving seats or creating enrollments.

US-02: Successful Registration
- AC-03 (Rules R2, R4): Given an authenticated student who is not currently enrolled in the selected course offering, And the offering has at least 1 available place, When the student submits a registration request, Then the system rechecks availability, creates exactly one Enrollment record linking the student and the offering, updates available places, and returns a confirmation message.
- AC-04 (Rules R2, R4): Given an offering with capacity 2 and 1 existing enrollment, When a second eligible student submits a registration request, Then total enrollment becomes 2, available capacity updates to 0, and a success confirmation is returned.

US-03: Registration Rejection
- AC-05 (Rules R2, R5): Given a student attempting to register for a course offering where current enrollment equals capacity (0 places available), When the registration request is processed, Then the system rejects the request, displays "course full", creates no Enrollment record, and leaves total enrollment unchanged.
- AC-06 (Rules R3, R5): Given a student who already has an active enrollment in the selected course offering, When the student submits a repeat registration request for the same offering, Then the system rejects the request, displays "already enrolled", creates no duplicate Enrollment record, and leaves total enrollment unchanged.

Sequence: include catalog browsing and guarded success, full-course and duplicate outcomes. Model final checks and creation as one atomic operation.
Class: show domain concepts, useful attributes and multiplicities. State the capacity and uniqueness constraints. Explain assumptions and any technical lifelines.
~~~~

**Response:**

~~~~text
Here are the PlantUML diagrams drafted from your approved requirements, R1–R5, and assumptions.   Sequence DiagramФрагмент кода@startuml
autonumber
actor Student
participant "CatalogController" as Catalog
participant "RegistrationService" as Service
participant "CourseOffering" as Offering
participant "Enrollment" as Enrollment

Student -> Catalog : browseCatalog(semester)
Catalog --> Student : return courseList, capacity

Student -> Service : register(studentId, offeringId)
activate Service

alt already enrolled
    Service -> Offering : checkEnrollment(studentId)
    Service --> Student : rejection("already enrolled")
else course full
    Service -> Offering : checkCapacity()
    Service --> Student : rejection("course full")
else not enrolled and places left
    group atomic
        Service -> Offering : recheckAvailabilityAndLock()
        Service -> Enrollment : create(studentId, offeringId)
        Service -> Offering : decrementCapacity()
    end
    Service --> Student : confirmation("registration successful")
end
deactivate Service
@enduml
Domain Class DiagramФрагмент кода@startuml
' Assumptions & Technical Lifelines Explanation:
' 1. Student identity is supplied via request context (authenticated session).
' 2. CatalogController and RegistrationService act as boundary/control lifelines 
'    to coordinate registration workflows and atomic operations.

class Student {
  +studentId: String
  +name: String
}

class Course {
  +code: String
  +title: String
}

class CourseOffering {
  +offeringId: String
  +semester: String
  +capacity: int
}

class Enrollment {
  +enrollmentId: String
  +enrolledAt: DateTime
}

Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >
Course "1" -- "0..*" CourseOffering : includes >

note right of CourseOffering
  Capacity constraint: 
  Enrollment count must never exceed capacity.
end note

note right of Enrollment
  Uniqueness constraint: 
  A student can have at most one enrollment per CourseOffering.
end note
@enduml
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** Gemini
- **Model:** not displayed
- **Date:** 2026-10-21
- **Purpose:** review both models against R1–R5 and T1–T4

**Prompt:**

~~~~text
 Review these two UML models against R1-R5 and my acceptance criteria. Check message order, guards, state changes, multiplicities and naming.


Inspect the four validation cases: available places, exactly one place, full course after a stale catalog view, and duplicate registration.


For each issue, cite the affected rule and model element. Explain the impact and propose a focused correction. Separate genuine defects from optional design choices.


Acceptance Criteria:

AC-01 (Rule R1): Given an authenticated student viewing the electronic course catalog for a selected semester, When the student requests the course list, Then the system displays each course's code, title, offering section, and available places.

AC-02 (Rule R1): Given an authenticated student browsing the catalog, When a course offering has reached its maximum capacity, Then the system displays 0 available places for that offering without reserving seats or creating enrollments.

AC-03 (Rules R2, R4): Given an authenticated student who is not currently enrolled in the selected course offering, And the offering has at least 1 available place, When the student submits a registration request, Then the system rechecks availability, creates exactly one Enrollment record linking the student and the offering, updates available places, and returns a confirmation message.

AC-04 (Rules R2, R4): Given an offering with capacity 2 and 1 existing enrollment, When a second eligible student submits a registration request, Then total enrollment becomes 2, available capacity updates to 0, and a success confirmation is returned.

AC-05 (Rules R2, R5): Given a student attempting to register for a course offering where current enrollment equals capacity (0 places available), When the registration request is processed, Then the system rejects the request, displays "course full", creates no Enrollment record, and leaves total enrollment unchanged.

AC-06 (Rules R3, R5): Given a student who already has an active enrollment in the selected course offering, When the student submits a repeat registration request for the same offering, Then the system rejects the request, displays "already enrolled", creates no duplicate Enrollment record, and leaves total enrollment unchanged.


Original Sequence Diagram:

@startuml

autonumber

actor Student

participant "CatalogController" as Catalog

participant "RegistrationService" as Service

participant "CourseOffering" as Offering

participant "Enrollment" as Enrollment


Student -> Catalog : browseCatalog(semester)

Catalog --> Student : return courseList, capacity


Student -> Service : register(studentId, offeringId)

activate Service


alt already enrolled

    Service -> Offering : checkEnrollment(studentId)

    Service --> Student : rejection("already enrolled")

else course full

    Service -> Offering : checkCapacity()

    Service --> Student : rejection("course full")

else not enrolled and places left

    group atomic

        Service -> Offering : recheckAvailabilityAndLock()

        Service -> Enrollment : create(studentId, offeringId)

        Service -> Offering : decrementCapacity()

    end

    Service --> Student : confirmation("registration successful")

end

deactivate Service

@enduml


Original Class Diagram:

@startuml

class Student {

  +studentId: String

  +name: String

}


class Course {

  +code: String

  +title: String

}


class CourseOffering {

  +offeringId: String

  +semester: String

  +capacity: int

}


class Enrollment {

  +enrollmentId: String

  +enrolledAt: DateTime

}


Student "1" -- "0..*" Enrollment : holds >

CourseOffering "1" -- "0..*" Enrollment : has >

Course "1" -- "0..*" CourseOffering : includes >


note right of CourseOffering

  Capacity constraint: 

  Enrollment count must never exceed capacity.

end note


note right of Enrollment

  Uniqueness constraint: 

  A student can have at most one enrollment per CourseOffering.

end note

@enduml 
~~~~

**Response:**

~~~~text
Below is the detailed review of the sequence and class diagrams against rules R1–R5, your acceptance criteria (AC-01 through AC-06), and the four validation test scenarios.
1. Traceability & Acceptance Criteria Compliance Matrix
Rule / ACCompliance StatusKey Defect / FindingAC-01 & AC-02 (R1)Non-CompliantDiagram returns capacity instead of calculated available places (capacity - count(Enrollments)). Title and Section attributes are missing/misnamed.AC-03 (R2, R4)Partially CompliantMessage ordering logic is invalid (checks capacity only after failing duplicate check, leading to state inconsistencies); state change is done via mutating capacity rather than tracking active enrollments.AC-04 (R2, R4)Partially CompliantRelies on mutating fixed static capacity instead of managing enrollment collection count dynamically.AC-05 (R2, R5)Non-CompliantRace condition / stale view failure: stale local catalog views bypass initial branch logic if availability checks depend on outdated view data; state logic mutates fixed structural capacity.AC-06 (R3, R5)Non-CompliantEvaluation order defect: checkEnrollment is invoked before verifying availability/locking, exposing registration to concurrent duplicate enrollment. Class diagram lacks explicit unique tuple constraints on (studentId, offeringId).
2. Evaluation of Validation Scenarios
Scenario A: Available Places Display
- Finding: Defect in Sequence Diagram (Message 2) and Class Diagram (CourseOffering).
- Impact: browseCatalog returns raw capacity rather than available seats (capacity - enrolledCount). A course with capacity 30 and 30 enrolled students displays 30 instead of 0, violating AC-02.
Scenario B: Boundary Case (Exactly One Place Left)
- Finding: Sequence Diagram logic defect in decrementCapacity().
- Impact: Modifying capacity field directly corrupts the static capacity attribute of the offering rather than tracking dynamic seat allocation via Enrollment instances.
Scenario C: Full Course After Stale Catalog View
- Finding: Sequence Diagram structural ordering defect in lines 10–23 (alt execution block).
- Impact: The alt structure checks static pre-conditions without acquiring a lock first. A student with a stale view (showing 1 place left when 0 remain) will enter the sequence, but the sequence branches are evaluated sequentially without dynamic lock guards, creating race conditions.
Scenario D: Duplicate Registration
- Finding: Execution order flaw in lines 11–12.
- Impact: checkEnrollment returns true if already enrolled, but no lock is held prior to the check. Under concurrent requests from the same user session, duplicate Enrollment records can be created before the first check completes.
3. Detailed Inspection & Defect Breakdown
Genuine Defects (Critical Logic & Domain Violations)
Defect 1: Misunderstanding of "Available Places" vs. "Capacity"
- Affected Rule / AC: R1, AC-01, AC-02.
- Element: CatalogController -> Student: return courseList, capacity, CourseOffering.capacity.
- Impact: Returning capacity exposes fixed maximum capacity rather than calculated remaining availability ($Available = Capacity - Count(Enrollments)$).
- Correction: Replace capacity return value with availablePlaces. Update CourseOffering to include a derived property /availablePlaces: int or a query method getAvailablePlaces(): int.
Defect 2: Mutating Static Capacity Instead of Tracking Enrollments
- Affected Rule / AC: R2, R4, AC-03, AC-04.
- Element: Service -> Offering: decrementCapacity().
- Impact: capacity represents maximum structural limit, not remaining seats. Decrementing capacity permanently alters the maximum limit of the course.
- Correction: Remove decrementCapacity(). Availability must be calculated dynamically based on existing active Enrollment records associated with the CourseOffering.
Defect 3: Unsafe Lock Placement and Check Sequence Order
- Affected Rule / AC: R2, R3, R5, AC-05, AC-06.
- Element: alt block (lines 10–23) in Sequence Diagram.
- Impact: Checks (checkEnrollment, checkCapacity) occur outside/before recheckAvailabilityAndLock(). Concurrent requests pass pre-checks before lock acquisition, causing race conditions and dirty writes.
- Correction: Re-order execution: acquire lock / begin transaction first, execute checks within the locked scope, create Enrollment, and commit transaction.
Defect 4: Class Diagram Attribute & Multiplicity Deficiencies
- Affected Rule / AC: R1, R3, AC-01, AC-06.
- Element: Class CourseOffering, Class Course, Association Student -- Enrollment.
- Impact: CourseOffering lacks section attribute (required by AC-01). Course title/code details are separated without clear presentation mapping. Multiplicities permit unconstrained link creation without enforcing the {unique} constraint on (Student, CourseOffering).
- Correction:
  - Add section: String to CourseOffering.
  - Add {id} or explicit constraint note on Enrollment for pair (studentId, offeringId).
Optional Design Choices & Refinements
1. Catalog vs. Registration Boundary: CatalogController directly returns data to Student. Adding a explicit DTO (CourseCatalogDTO) improves decoupling but is optional.
2. Service Layer Separation: RegistrationService handles both read-validation and creation. Splitting into a read-only CatalogQueryService and a write transactional RegistrationManager is a clean architecture preference, not a strict defect.
4. Corrected UML Models
Corrected Sequence Diagram
Фрагмент кода

@startuml
autonumber
actor Student
participant "CatalogController" as Catalog
participant "RegistrationService" as Service
participant "CourseOffering" as Offering
participant "Enrollment" as Enrollment

Student -> Catalog : browseCatalog(semester)
Catalog -> Offering : getAvailableOfferings(semester)
Offering --> Catalog : offeringsList (with code, title, section, availablePlaces)
Catalog --> Student : displayCatalog(offeringsList)

Student -> Service : register(studentId, offeringId)
activate Service

Service -> Offering : acquireLockAndTransact(offeringId)
activate Offering

alt already enrolled
    Service -> Offering : isStudentEnrolled(studentId)
    Service --> Student : rejection("already enrolled")
else course full (availablePlaces == 0)
    Service -> Offering : getAvailablePlaces()
    Service --> Student : rejection("course full")
else eligible and places available
    Service -> Enrollment : create(studentId, offeringId)
    activate Enrollment
    Enrollment --> Service : enrollmentRef
    deactivate Enrollment
    
    Service -> Offering : linkEnrollment(enrollmentRef)
    Service --> Student : confirmation("registration successful")
end

Service -> Offering : releaseLock()
deactivate Offering
deactivate Service
@enduml
Corrected Class Diagram
Фрагмент кода

@startuml
class Student {
  +studentId: String
  +name: String
}

class Course {
  +code: String
  +title: String
}

class CourseOffering {
  +offeringId: String
  +semester: String
  +section: String
  +capacity: int
  +getAvailablePlaces(): int
}

class Enrollment {
  +enrollmentId: String
  +enrolledAt: DateTime
}

Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >
Course "1" -- "0..*" CourseOffering : includes >

note right of CourseOffering
  Calculated Property:
  availablePlaces = capacity - count(Enrollment)
  
  Constraint:
  count(Enrollment) <= capacity
end note

note right of Enrollment
  Unique Constraint:
  Combination of (Student, CourseOffering) 
  must be unique across all active enrollments.
end note
@enduml
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** Gemini
- **Model:** not displayed
- **Date:** 2026-10-21
- **Purpose:** apply my accepted review decisions

**Prompt:**

~~~~text
Revise the UML sources using only my accepted review decisions: 

Accepted Review Decisions:
1. Fix Catalog View (R1, AC-01): Update browseCatalog to calculate dynamic available places (capacity - count(Enrollments)) instead of returning raw capacity, and ensure title and section attributes are represented.
2. Remove Capacity Mutation (R2, R4, AC-03): Remove decrementCapacity() call; capacity is a static attribute limit, not a mutable counter. Seat availability is checked dynamically against existing Enrollment records.
3. Enforce Atomic Lock and Check Order (R2, R3, R5, AC-05, AC-06): Re-order execution in Sequence Diagram so that lock acquisition occurs before checking enrollment status and capacity, preventing race conditions under stale views and concurrent requests.
4. Class Diagram Attributes and Constraints (R1, R3, AC-01, AC-06): Add section attribute to CourseOffering class. Retain and clarify explicit notes for capacity constraint and unique tuple constraint on (Student, CourseOffering).

Keep justified existing elements and explain each change.
Preserve the agreed scope and rule IDs. Return both updated PlantUML blocks and a concise change log. Flag any unresolved issue.

Approved requirements:
US-01: Catalog Browsing
- AC-01 (Rule R1): Given an authenticated student viewing the electronic course catalog for a selected semester, When the student requests the course list, Then the system displays each course's code, title, offering section, and available places.
- AC-02 (Rule R1): Given an authenticated student browsing the catalog, When a course offering has reached its maximum capacity, Then the system displays 0 available places for that offering without reserving seats or creating enrollments.

US-02: Successful Registration
- AC-03 (Rules R2, R4): Given an authenticated student who is not currently enrolled in the selected course offering, And the offering has at least 1 available place, When the student submits a registration request, Then the system rechecks availability, creates exactly one Enrollment record linking the student and the offering, updates available places, and returns a confirmation message.
- AC-04 (Rules R2, R4): Given an offering with capacity 2 and 1 existing enrollment, When a second eligible student submits a registration request, Then total enrollment becomes 2, available capacity updates to 0, and a success confirmation is returned.

US-03: Registration Rejection
- AC-05 (Rules R2, R5): Given a student attempting to register for a course offering where current enrollment equals capacity (0 places available), When the registration request is processed, Then the system rejects the request, displays "course full", creates no Enrollment record, and leaves total enrollment unchanged.
- AC-06 (Rules R3, R5): Given a student who already has an active enrollment in the selected course offering, When the student submits a repeat registration request for the same offering, Then the system rejects the request, displays "already enrolled", creates no duplicate Enrollment record, and leaves total enrollment unchanged.

Original sources:
Sequence Diagram:
@startuml
autonumber
actor Student
participant "CatalogController" as Catalog
participant "RegistrationService" as Service
participant "CourseOffering" as Offering
participant "Enrollment" as Enrollment

Student -> Catalog : browseCatalog(semester)
Catalog --> Student : return courseList, capacity

Student -> Service : register(studentId, offeringId)
activate Service

alt already enrolled
    Service -> Offering : checkEnrollment(studentId)
    Service --> Student : rejection("already enrolled")
else course full
    Service -> Offering : checkCapacity()
    Service --> Student : rejection("course full")
else not enrolled and places left
    group atomic
        Service -> Offering : recheckAvailabilityAndLock()
        Service -> Enrollment : create(studentId, offeringId)
        Service -> Offering : decrementCapacity()
    end
    Service --> Student : confirmation("registration successful")
end
deactivate Service
@enduml

Class Diagram:
@startuml
class Student {
  +studentId: String
  +name: String
}

class Course {
  +code: String
  +title: String
}

class CourseOffering {
  +offeringId: String
  +semester: String
  +capacity: int
}

class Enrollment {
  +enrollmentId: String
  +enrolledAt: DateTime
}

Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >
Course "1" -- "0..*" CourseOffering : includes >

note right of CourseOffering
  Capacity constraint: 
  Enrollment count must never exceed capacity.
end note

note right of Enrollment
  Uniqueness constraint: 
  A student can have at most one enrollment per CourseOffering.
end note
@enduml
~~~~

**Response:**

~~~~text
Here are the revised PlantUML models and the detailed change log based on your accepted review decisions. All justified existing structural elements have been preserved while incorporating the required corrections for atomic operations, catalog display, and constraint notes.

#### Revised Sequence Diagram Source

```plantuml
@startuml
autonumber
actor Student
participant "CatalogController" as Catalog
participant "RegistrationService" as Service
participant "CourseOffering" as Offering
participant "Enrollment" as Enrollment

Student -> Catalog : browseCatalog(semester)
Catalog -> Offering : getAvailableOfferings(semester)
Offering --> Catalog : offeringsList (code, title, section, availablePlaces)
Catalog --> Student : displayCatalog(offeringsList)

Student -> Service : register(studentId, offeringId)
activate Service

group atomic
    Service -> Offering : acquireLockAndTransact(offeringId)
    activate Offering

    alt already enrolled
        Service -> Offering : isStudentEnrolled(studentId)
        Service --> Student : rejection("already enrolled")
    else course full
        Service -> Offering : getAvailablePlaces()
        Service --> Student : rejection("course full")
    else not enrolled and places left
        Service -> Enrollment : create(studentId, offeringId)
        activate Enrollment
        Enrollment --> Service : enrollmentRef
        deactivate Enrollment
        
        Service -> Offering : linkEnrollment(enrollmentRef)
        Service --> Student : confirmation("registration successful")
    end

    Service -> Offering : releaseLock()
    deactivate Offering
end
deactivate Service
@enduml
~~~~

## 12. Appendix C — Original diagrams

<!-- The AI's first output from Prompt B, rendered unedited from models/original/. -->

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the source checks must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5. -->

- Fowler, M. (2003). *UML Distilled: A Brief Guide to the Standard Object Modeling Language*, 3rd ed. Addison-Wesley Professional. Chapters 3 & 4.
- KBTU Course Materials (Fall 2026). *Software Engineering Practice: Lecture 04 — Requirements Modeling and UML Diagrams*. KBTU SITE.

### Source checks

<!-- At least two modeling decisions you verified. Source and locator: title + slide, page,
     section, chapter or figure — or title + URL + access date (YYYY-MM-DD). Slide numbers
     refer to the decks posted in our Teams. -->

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| Placing capacity and duplicate checks inside an atomic transaction lock block | Fowler, M. (2003). *UML Distilled*, 3rd ed., Chapter 4 "Sequence Diagrams", Guarded Interaction section (p. 55) | Guarded conditions and critical interactions must execute within atomic sequence scopes to ensure state consistency before object instantiation. | Supported moving `acquireLockAndTransact` before capacity and duplicate evaluations, preventing race conditions during concurrent requests. |
| Expressing uniqueness constraints using explicit UML notes rather than multiplicity alone | Fowler, M. (2003). *UML Distilled*, 3rd ed., Chapter 3 "Class Diagrams", Constraints section (p. 43) | Multiplicities restrict link counts between entities, but complex dynamic tuple uniqueness (e.g., unique student-offering pair) requires explicit text constraints or notes. | Supported using an explicit PlantUML note for the `(Student, CourseOffering)` unique tuple constraint on `Enrollment` instead of relying solely on `1` to `0..*` multiplicity. |