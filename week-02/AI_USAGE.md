# AI Usage Disclosure — Week 02

Required by the course academic policy (Generative AI use level **D** — AI-integrated).
AI use is **the subject** of this lab, not a shortcut in it. You remain responsible for the
accuracy, testing and integrity of everything you submit, including everything an AI produced.

## 1. The tool under test

| | |
| --- | --- |
| Assistant | ChatGPT |
| Exact model name | GPT-6 Astra |
| Plan (free / paid) | free |
| Dates of the four runs | 20.09.2026 |

## 2. What it produced

| Prompt | File it produced | Edited by me afterwards? |
| --- | --- | --- |
| A | `week-02/code/prompt_a.py` | no |
| B | `week-02/code/prompt_b.py` | no |
| C | `week-02/code/prompt_c.py` | no |
| D | `week-02/code/prompt_d.py` | no |

Only the code block of each response was saved into the file; the surrounding explanation text
(and, for C, the explanation tables) was not saved as code. No line of code was changed.

## 3. Any other AI use in this lab

| Tool | Used for | Which file or section |
| --- | --- | --- |
| Claude (separate chat from the four test runs) | Explaining the lab instructions and the order of steps; drafting the wording of sections 2, 3, 4, 5 (the "what I added" and ambiguity text), 6 (the FAIL/ERROR line and the answers about C's tests), 7 (scoring table, word counts, ratio line) of `lab-report.md`; sections 8 (conclusion) and 9 (debrief questions) were drafted almost entirely by the AI; pointing out arithmetic errors in section 7; feedback on gaps in my Prompt D; drafting this file | `lab-report.md` sections 2–9, `AI_USAGE.md` |

Facts, code outputs and test results used in those sections come from my own real runs: I ran the
four prompts in fresh chats and pasted the harness output unedited. Prompt D was written by me;
the AI only commented on gaps in it and suggested possible additions.

## 4. Declarations

- **Every prompt was sent in a fresh chat, and the outputs were saved before any editing:** yes
- **The test results in section 6 of `lab-report.md` are real output from real runs:** yes
- **Everything I submitted, I can explain and defend in class:** yes

**Anything I accepted from the AI without fully understanding it:**
The `isinstance(mark, bool)` check in `prompt_b.py` and `prompt_d.py` (I did not ask for it, and
only learned that `True` counts as a number in Python while reading the code), and why the
harness's tolerance of 0.01 lets B's unrounded `pass_rate=66.66666666666666` pass case 1.

Signed: Madi Adilet
Date: 20.09.2026
