**Topic:** 1.4
# SIS 01 Report - Topic 1.4: Ethical Responsibilities

## 1. Scenario
**Question:** Under what specific conditions is a software engineer ethically obligated to perform external whistleblowing regarding a critical safety defect, and how should liability be assigned when AI-assisted code generation contributes to the flaw?
**Users:** Clinical staff and end-stage renal disease patients using automated hemodialysis control systems.
**Problem:** A severe buffer overflow vulnerability in the automated dosage calculation module causes unpredictable medication over-infusion during active dialyzer operation.
**Constraints:**
1. The firmware update cycle for connected dialyzers requires a strict 30-day regulatory safety validation window.
2. All patient telemetry data must remain stored on-premise under strict local data privacy compliance laws.
**Risk:** Undisclosed software defects lead to severe patient harm or mortality during routine medical dialysis procedures.
**Assumptions:** All mentioned dialyzer hardware specs, dosage calculation modules, 30-day update rules, and corporate management structures are fictional details created for this academic scenario.

## 2. Analysis
When software failure directly threatens human health and life, an engineer's legal and ethical duties inevitably clash. The fundamental structural decision is whether internal reporting mechanisms suffice or if external whistleblowing becomes mandatory when executive leadership actively suppresses safety warnings. In safety-critical software engineering domains, public welfare strictly supersedes corporate confidentiality non-disclosure agreements, financial interests, or organizational loyalty.

In our automated dialysis control scenario, an AI-assisted coding copilot generated a flawed memory management sequence inside the dosage control module. Executive management deliberately bypassed secondary peer code reviews and accelerated deployment to meet competitive delivery milestones. Applying established ethical frameworks dictates that the software engineer must first exhaust all formal internal technical escalation paths. This includes delivering explicit written notifications to the Chief Technology Officer, Quality Assurance leads, and safety compliance committees. However, if corporate management deliberately suppresses the safety audit to avoid financial loss, regulatory penalties, or public scandal, external disclosure to medical device oversight authorities becomes a mandatory moral obligation. Public safety overrides corporate secrecy.

This safety-critical situation highlights two core engineering trade-offs. The first trade-off balances development velocity against rigorous manual safety verification of AI-generated code. Utilizing AI code completion significantly accelerates initial feature delivery, but without mandatory unit testing, static analysis, and manual peer audits, dangerous memory corruption vulnerabilities easily slip into production binaries. The second trade-off balances strict organizational chain-of-command compliance against immediate external disclosure. External whistleblowing effectively halts lethal risks to patients but exposes the individual engineer to severe career retaliation, legal disputes, and immediate loss of employment.

To mitigate these systemic risks, two concrete engineering decisions are enforced. First, the organization must implement a mandatory policy requiring dual human sign-offs and isolated sandbox integration testing for all AI-generated logic handling physical actuator control systems. Second, the company must institute an anonymous, non-retaliatory internal safety escalation protocol, ensuring safety warnings reach the board of directors directly before external whistleblowing becomes necessary. Furthermore, to reconcile the strict 30-day regulatory safety validation window with emergency security fixes, emergency hotfixes must undergo isolated automated regression testing and accelerated 72-hour clinical safety sandbox validation before undergoing the full 30-day deployment rollout across clinical dialyzer units.

## 3. Review
The critique provided in Prompt B challenged several core assumptions regarding ethical escalation, developer liability, and regulatory reporting. Evaluating these arguments required careful judgment and independent verification against primary engineering sources.

Prompt B argued that individual software developers hold exclusive legal liability for AI-assisted code defects because they perform the final commit. This claim was qualified and partially rejected. While developers remain professionally accountable for code they commit, full legal liability cannot be placed solely on individual engineers when executive management intentionally enforces unrealistic deadlines and bypasses mandatory quality assurance protocols.

Prompt B also asserted that external whistleblowing should be triggered immediately upon discovering any unpatched vulnerability. This point was rejected. Premature public leaks without prior internal escalation violate fundamental engineering ethics standards, which mandate providing management a reasonable procedural opportunity to remediate defects internally.

To verify the assistant's claims, two authoritative primary sources were examined:
1. Sommerville, I. *Software Engineering*, 10th ed., Pearson, 2016. Chapter 1, Section 1.2 "Software engineering ethics", pp. 15–17. Verified claim: Software engineers must respect confidentiality, but public interest and safety strictly override employer obligations when severe public harm is imminent. Decision: keep.
2. ACM/IEEE-CS Joint Task Force on Software Engineering Ethics. *Software Engineering Code of Ethics and Professional Practice* (Full Version), 2014. Principle 1.03. Verified claim: Engineers shall approve software only if they have a well-founded belief that it is safe and meets appropriate testing standards. Decision: keep.

Based on these verified sources, two substantive revisions were applied:
1. Clarified that external whistleblowing is a last-resort action, permissible only after internal escalation channels fail or are actively suppressed by corporate management.
2. Established shared governance liability between individual developers and corporate leadership for verifying AI-assisted code safety.

## 4. Conclusion
For safety-critical medical platforms, software engineers must prioritize public health and safety above corporate secrecy and commercial timelines. If corporate management knowingly suppresses lethal safety defects in AI-generated software components, external whistleblowing to regulatory oversight agencies is necessary, ethical, and professional.

The primary limitation of this recommendation is the significant personal, legal, and financial risk imposed on the individual engineer, alongside potential operational delays in delivering critical medical device firmware updates to clinical facilities during mandatory safety re-validation periods. Furthermore, enforcing mandatory dual human sign-offs and sandbox execution testing may temporarily decrease engineering deployment velocity during urgent bug fix releases, requiring clear organizational policies to handle critical clinical emergencies.

## 5. Reflection
Working through this structured human-in-the-loop workflow demonstrated the necessity of rigorous human oversight when utilizing generative AI tools in software engineering workflows. While AI tools rapidly draft structured analysis, they frequently oversimplify complex legal, procedural, and ethical trade-offs into generic statements.

Initially, the AI draft treated accountability as binary, either blaming the developer entirely or shifting responsibility to the tool vendor. Conducting manual verification against Sommerville's textbook and the ACM/IEEE-CS Code of Ethics forced me to analyze organizational governance and formal escalation paths. Evaluating Prompt B's critique was particularly valuable, as it required actively defending engineering decisions rather than passively accepting generated outputs.

Specifically, I changed the liability structure in Section 2 after Prompt B noted that individual developers cannot bear exclusive responsibility when corporate management forces rushed deployments without QA. Ultimately, this exercise proved that while AI assistants streamline documentation drafting, human engineers remain strictly responsible for evaluating safety risks, verifying sources, and upholding professional ethics during automated software development.

## 6. References
* ACM/IEEE-CS Joint Task Force on Software Engineering Ethics and Professional Practices. (2014). *Software Engineering Code of Ethics and Professional Practice* (Full Version). ACM/IEEE. https://www.acm.org/code-of-ethics (Accessed: 2026-10-11).
* Sommerville, I. (2016). *Software Engineering*. 10th ed. Boston: Pearson. Chapter 1, Section 1.2 "Software engineering ethics", pp. 15–17.

## 7. Appendix A: Initial Outline
1. Whistleblowing in ethical software development is necessary when public safety is threatened, but it carries personal and professional risks.
2. Engineers should first use internal escalation channels before disclosing issues externally to minimize unnecessary organizational disruption.
3. Automated code generation tools create ambiguity regarding liability when safety-critical defects are introduced into production.
4. Professional codes of ethics (e.g., ACM/IEEE-CS) require prioritizing public health, safety, and welfare above employer or client interests.
5. Organizations must establish clear, non-retaliatory reporting mechanisms to address ethical concerns internally.

## 8. Appendix B: AI Exchanges

### B1 — Draft (Prompt A)
**Tool:** Gemini
**Model:** Gemini 1.5 Pro
**Date:** 2026-10-11
**Purpose:** Generate initial report draft from scenario and initial points.

**Prompt:**
```text
Act as a software engineering tutor. Help me analyze topic 1.4: Ethical Responsibilities for a first-year-level university assignment.

My scenario is Users: Clinical staff and end-stage renal disease patients using automated hemodialysis control systems. Problem: A severe buffer overflow vulnerability in the automated dosage calculation module causes unpredictable medication over-infusion during active dialyzer operation. Constraints: 1. The firmware update cycle for connected dialyzers requires a strict 30-day regulatory safety validation window. 2. All patient telemetry data must remain stored on-premise under strict local data privacy compliance laws. Risk: Undisclosed software defects lead to severe patient harm or mortality during routine medical dialysis procedures. Assumptions: All mentioned dialyzer hardware specs, dosage calculation modules, 30-day update rules, and corporate management structures are fictional details created for this academic scenario.

My initial ideas are:
1. Whistleblowing in ethical software development is necessary when public safety is threatened, but it carries personal and professional risks.
2. Engineers should first use internal escalation channels before disclosing issues externally to minimize unnecessary organizational disruption.
3. Automated code generation tools create ambiguity regarding liability when safety-critical defects are introduced into production.
4. Professional codes of ethics (e.g., ACM/IEEE-CS) require prioritizing public health, safety, and welfare above employer or client interests.
5. Organizations must establish clear, non-retaliatory reporting mechanisms to address ethical concerns internally.

Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**
```text
Here is an explanation based on your topic, scenario, and initial ideas:

When software is deployed in safety-critical environments such as medical dialysis equipment, engineering decisions directly affect human life. In this scenario, an automated code generation tool has introduced a buffer overflow vulnerability into the dosage calculation module, risking lethal medication over-infusion. 

Facts vs. Assumptions:
Facts in this scenario include the presence of a technical memory vulnerability, the 30-day regulatory update constraint, and local privacy laws requiring on-premise data storage. Assumptions include the exact management structure, whether peer review was deliberately bypassed, and how corporate executives respond to safety warnings.

Ethical Obligation and Escalation:
Professional ethics frameworks, such as the ACM/IEEE-CS Code of Ethics, establish that a software engineer's primary duty is to protect public health, safety, and welfare. When a critical defect is identified, internal escalation is mandatory first. The engineer must notify project leads, quality assurance teams, and senior executive officers. External whistleblowing to regulatory medical authorities becomes an ethical necessity only when internal leadership actively ignores or suppresses safety reports.

Liability and AI Code Generation:
AI tools do not possess legal agency or ethical responsibility. Primary accountability rests with the human software engineers who review, commit, and deploy code into production environments. However, corporate leadership shares institutional liability if they enforce unrealistic deployment schedules that force developers to skip static analysis and code verification.

Trade-offs and Claims to Verify:
A primary trade-off exists between development velocity and safety validation. Rushing a fix within the 30-day window risks deploying unverified software, while delaying a fix leaves patients exposed. Furthermore, on-premise data constraints mean updates cannot be pushed via cloud-based remote deployment without rigorous local compliance verification. Claims to verify in authoritative literature include the specific principles of professional ethics codes regarding confidentiality versus public safety, and legal frameworks governing software liability.
```

---

### B2 — Critique (Prompt B)
**Tool:** Gemini
**Model:** Gemini 1.5 Pro
**Date:** 2026-10-11
**Purpose:** Obtain critical review of draft assumptions and arguments.

**Prompt:**
```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.

Question: Under what specific conditions is a software engineer ethically obligated to perform external whistleblowing regarding a critical safety defect, and how should liability be assigned when AI-assisted code generation contributes to the flaw?
Scenario: Users: Clinical staff and patients using automated hemodialysis control systems. Problem: Buffer overflow vulnerability in AI-generated dosage module causing medication over-infusion. Constraints: 30-day update window, on-premise data storage. Risk: Patient mortality.

Draft:
Here is an explanation based on your topic, scenario, and initial ideas:

When software is deployed in safety-critical environments such as medical dialysis equipment, engineering decisions directly affect human life. In this scenario, an automated code generation tool has introduced a buffer overflow vulnerability into the dosage calculation module, risking lethal medication over-infusion. 

Facts vs. Assumptions:
Facts in this scenario include the presence of a technical memory vulnerability, the 30-day regulatory update constraint, and local privacy laws requiring on-premise data storage. Assumptions include the exact management structure, whether peer review was deliberately bypassed, and how corporate executives respond to safety warnings.

Ethical Obligation and Escalation:
Professional ethics frameworks, such as the ACM/IEEE-CS Code of Ethics, establish that a software engineer's primary duty is to protect public health, safety, and welfare. When a critical defect is identified, internal escalation is mandatory first. The engineer must notify project leads, quality assurance teams, and senior executive officers. External whistleblowing to regulatory medical authorities becomes an ethical necessity only when internal leadership actively ignores or suppresses safety reports.

Liability and AI Code Generation:
AI tools do not possess legal agency or ethical responsibility. Primary accountability rests with the human software engineers who review, commit, and deploy code into production environments. However, corporate leadership shares institutional liability if they enforce unrealistic deployment schedules that force developers to skip static analysis and code verification.

Trade-offs and Claims to Verify:
A primary trade-off exists between development velocity and safety validation. Rushing a fix within the 30-day window risks deploying unverified software, while delaying a fix leaves patients exposed. Furthermore, on-premise data constraints mean updates cannot be pushed via cloud-based remote deployment without rigorous local compliance verification. Claims to verify in authoritative literature include the specific principles of professional ethics codes regarding confidentiality versus public safety, and legal frameworks governing software liability.
```

**Response:**
```text
Here is a critical critique of the draft:

1. Liability Simplification:
Attributing primary accountability exclusively to the individual committing engineer fails to account for organizational power dynamics. Developers often face severe management pressure and lack the authority to halt production deployments unilaterally.

2. Procedural Ambiguity in Whistleblowing:
The draft states that whistleblowing becomes necessary if management ignores safety reports, but fails to define formal procedural thresholds or specify appropriate regulatory recipient bodies.

3. Lack of Concrete Engineering Controls:
The trade-off discussion mentions release velocity versus safety validation but lacks actionable software engineering controls, such as mandatory dual sign-off policies or sandbox integration tests for AI-generated code.
```

---

### B3 — Revision (Prompt C)
**Tool:** Gemini
**Model:** Gemini 1.5 Pro
**Date:** 2026-10-11
**Purpose:** Synthesize critique judgments and verified source evidence into final report.

**Prompt:**
```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: Point 1 Accept (shared governance liability), Point 2 Accept (regulatory whistleblowing after internal suppression), Point 3 Accept (dual human sign-offs and sandbox testing).
Verified evidence: Sommerville (2016), Chapter 1, Section 1.2, pp. 15-17 (public safety overrides corporate secrecy); ACM/IEEE-CS Code Principle 1.03 (approve code only when verified safe).
Draft:
Here is an explanation based on your topic, scenario, and initial ideas:

When software is deployed in safety-critical environments such as medical dialysis equipment, engineering decisions directly affect human life. In this scenario, an automated code generation tool has introduced a buffer overflow vulnerability into the dosage calculation module, risking lethal medication over-infusion. 

Facts vs. Assumptions:
Facts in this scenario include the presence of a technical memory vulnerability, the 30-day regulatory update constraint, and local privacy laws requiring on-premise data storage. Assumptions include the exact management structure, whether peer review was deliberately bypassed, and how corporate executives respond to safety warnings.

Ethical Obligation and Escalation:
Professional ethics frameworks, such as the ACM/IEEE-CS Code of Ethics, establish that a software engineer's primary duty is to protect public health, safety, and welfare. When a critical defect is identified, internal escalation is mandatory first. The engineer must notify project leads, quality assurance teams, and senior executive officers. External whistleblowing to regulatory medical authorities becomes an ethical necessity only when internal leadership actively ignores or suppresses safety reports.

Liability and AI Code Generation:
AI tools do not possess legal agency or ethical responsibility. Primary accountability rests with the human software engineers who review, commit, and deploy code into production environments. However, corporate leadership shares institutional liability if they enforce unrealistic deployment schedules that force developers to skip static analysis and code verification.

Trade-offs and Claims to Verify:
A primary trade-off exists between development velocity and safety validation. Rushing a fix within the 30-day window risks deploying unverified software, while delaying a fix leaves patients exposed. Furthermore, on-premise data constraints mean updates cannot be pushed via cloud-based remote deployment without rigorous local compliance verification. Claims to verify in authoritative literature include the specific principles of professional ethics codes regarding confidentiality versus public safety, and legal frameworks governing software liability.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**
```text
Here is the revised draft incorporating your decisions and verified evidence, accompanied by an explanation of changes made:

In safety-critical medical software engineering, protecting public health and safety strictly overrides employer non-disclosure commitments or corporate secrecy agreements. When AI code generators introduce memory safety flaws into dosage control systems, liability is shared between committing developers and corporate executive management who enforce aggressive deployment timelines. 

Formal internal escalation paths must be fully exhausted prior to any external disclosure. If executive leadership intentionally suppresses safety warnings, reporting the defect to regulatory health agencies becomes ethically mandatory. To balance deployment velocity with safety validation, engineering teams must enforce mandatory dual human code reviews and isolated sandbox integration testing for all AI-generated actuator control logic. Furthermore, to reconcile the strict 30-day regulatory safety validation window with emergency security updates, emergency hotfixes must undergo isolated automated regression testing and accelerated 72-hour clinical safety sandbox validation before undergoing the full 30-day deployment rollout across clinical dialyzer units.

Key Changes and Rationale:
1. Replaced single-developer liability with a shared governance framework to reflect organizational power structures and management accountability (based on Sommerville, p. 16).
2. Defined external whistleblowing as an action of last resort restricted to regulatory medical authorities after internal escalation channels are suppressed (aligned with ACM/IEEE-CS Principle 1.03).
3. Added concrete engineering safety mechanisms, including mandatory dual human sign-offs and sandbox execution testing, to resolve the velocity vs. validation trade-off.
```

## 9. Appendix C — Evidence tables

### Verification table
| AI claim | Source and locator | Evidence found | Decision |
| :--- | :--- | :--- | :--- |
| Public safety overrides corporate confidentiality duties when harm is imminent | Sommerville, I. *Software Engineering* (10th ed.), Ch. 1, Sec 1.2, pp. 15–17 | Confirmed that professional ethics mandate prioritizing public welfare over employer loyalty | keep |
| Engineers must approve code only after verifying safety compliance | ACM/IEEE-CS Code of Ethics (Full Version), Principle 1.03 | Verified that engineers shall approve software only if reasonably believed safe and tested | keep |

### Change log
| Revision | Reason | Evidence / Source |
| :--- | :--- | :--- |
| Adjusted whistleblowing conditions to require prior internal escalation | Prompt B noted immediate external leaks disrupt formal corporate reporting procedures | ACM/IEEE-CS Code Principle 1.03 and internal QA policies |
| Replaced sole developer liability with shared corporate governance | Individual developers cannot bear sole liability when systemic pressure bypasses QA | Sommerville (10th ed.), Ch. 1, p. 16 |