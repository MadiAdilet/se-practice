# AI Usage Disclosure — Week 04

Required by the course academic policy (Generative AI use level **D** — AI-integrated). You are
responsible for the accuracy of everything you submit, including every diagram an AI drafted.

| Tool | Exact model | Used for | Which files it touched |
| --- | --- | --- | --- |
| Gemini | Gemini 3.5 Flash-Lite | Task 1 — use-case draft | `models/original/use-case.puml` |
| Gemini | Gemini 3.5 Flash-Lite | Task 2 — class draft | `models/original/class.puml` |
| Gemini | Gemini 3.5 Flash-Lite | Task 3B — behaviour draft (activity) | `models/original/activity.puml` |
| Gemini | Gemini 3.5 Flash-Lite | Critique of the revised diagrams (new chat, second run) | `lab-report.md` §6 |
| | | | |

**The files in `models/original/` are the AI's first replies, unedited:** yes
<!-- Only the PlantUML code of each reply is saved there; the explanatory text of the replies is not saved. -->

**The revised diagrams in `models/` were corrected by me, and I can explain every element:** yes
<!-- The revised diagrams were written by Claude from my review of the Gemini drafts; I went through each element. -->

**Did an AI write any part of `lab-report.md` other than the critique it produced?** yes
<!-- Claude drafted §2.1-2.3, §3, §4, §5, §6 verdicts, §7 and §8; I checked them against my diagrams and changed what did not match. §1 and §9 contain my details and the real checker output; §10 was drafted by Claude from the review findings and I checked it against my files. -->

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the element, or write "nothing". -->
nothing

Notes on process:
- My first two chats with Gemini did not contain the full approved stories in the first message, so the first use-case answer was about course registration, not Smart Campus. I restarted the chat with the stories and rules.
- The critique prompt was run twice. The first run was on the original use-case file by mistake, so its results were discarded. §6 holds the second run, on the three revised files in a new chat.

Signed: Madi Adilet
Date: 2026-10-04
