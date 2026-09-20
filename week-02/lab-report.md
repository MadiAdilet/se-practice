# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:**
**Group:**
**Date:**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | |
| Exact model name | |
| Implementation language | |
| Date of the runs | |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
(paste here, or write "n/a — used Python")
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes / no
- No follow-up questions were asked before Part 7: yes / no
- Every output was saved **before** any editing: yes / no

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

Write Python code to analyze student marks.

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Marks arrive as one comma-separated string, hardcoded in the script (raw_marks = "88, 47, -5, ...").
2. The pass threshold of 50 is hardcoded.
3. Invalid values (-5, 101, "abc", empty) are silently skipped with except: pass instead of raising an error.
4. Results are printed with print(), not returned from a function.
5. Rounding to 2 decimals happens only in the printed output.
6. Unrequested extras: number of students, number of passed students, "Expected Output" and a function table.

**Questions it should have asked and did not:**

1. What should happen with invalid input: skip it or raise an error?
2. Should the result be a function's return value or printed output, and where do the marks come from?

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called:
no — there is no function at all; the code runs at top level

**First impression before testing** (one sentence — you will compare this with section 6 later):

It looks like a working demo script, but it is not a reusable function and will probably fail the harness.

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.

**What B fixed compared to A:**

1. A had no function at all (top-level script). B defines analyze_marks(marks, pass_mark=50) with the required name and signature.
2. A printed results and hardcoded the data and the threshold 50. B returns a dictionary with the exact keys average, highest, lowest, pass_rate, and pass_mark is a parameter.
3. A silently skipped invalid values (except: pass). B raises ValueError for an empty list, non-numeric values (including bool) and values outside 0-100.
4. B uses >= pass_mark, so a mark equal to the pass mark passes.

**What B still leaves open:**

1. Rounding of pass_rate: B returns the raw value (66.666... for [40, 60, 80]), while the spec example says 66.67. The prompt never says whether to round.
2. No tests were written, and no assumptions were stated before the code (only a short explanation after it).
3. Unrequested noise: example usage with print() at module level, which runs on import.
4. pass_mark itself is not validated (for example a text pass_mark would raise TypeError, not ValueError).

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark |yes ([75]) |
| decimals | yes ([65.5, 72.5, 80.0])|
| custom pass_mark |yes (pass_mark=70) |
| empty list |	yes |
| text value | yes ([50, "abc", 80])|
| below 0 / above 100 | yes, two separate tests (-5 and 105)|

**Do the AI's own tests pass against the AI's own code?** yes / no

**Do they agree with the harness in section 6?** yes / no — if no, where do they disagree:

**Assumptions C stated explicitly before the code:**

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

You are a Python developer. Implement the function analyze_marks(marks, pass_mark=50). Return exactly one dictionary with the keys 'average', 'highest', 'lowest', and 'pass_rate'. 

Constraints and Validation:
- Use no external libraries.
- Raise ValueError explicitly if the list is empty, contains non-numeric values (e.g., strings), or contains numbers outside the 0-100 range.

Logic & Ambiguities Resolved:
- A mark is considered passing if it is >= pass_mark.
- Round 'average' and 'pass_rate' to 2 decimal places.

Example: 
analyze_marks([40, 60, 80], 50) -> {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}

Include simple assert tests for: one mark, decimals, custom pass_mark, empty list, text value, and marks below 0 or above 100. State any assumptions in comments before the code. Do not include any extra features, CLI, or printed explanations. Return only code.

**What I deliberately added that A, B and C did not have:**

1. An explicit resolution of the rounding ambiguity: "Round 'average' and 'pass_rate' to 2 decimal places", plus an example showing 66.67.
2. An explicit pass rule ("passing if >= pass_mark") under a heading "Ambiguities Resolved", instead of leaving it implicit.
3. An explicit ban on noise: "Do not include any extra features, CLI, or printed explanations. Return only code", and assumptions moved into code comments.
4. Tests as simple assert statements (silent unless something fails), instead of C's print-based tests.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

The specification gives pass_rate 66.67 for [40, 60, 80], but never says whether to round. B computed
(2/3)*100 without rounding and returned 66.666..., which differs from the example in the third decimal.
I resolved it in D by requiring rounding to 2 decimal places and by giving the example 66.67.
I also had to decide that a mark equal to pass_mark passes (>=), because the case [49.5, 50] depends on it.

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | | | | |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | | | | |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | | | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | | | | |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | | | | |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | | | | |
| | **Totals** | | /6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| | | |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```

```

**Prompt B**

```

```

**Prompt C**

```

```

**Prompt D**

```

```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | | | | |
| Requirement coverage | | | | |
| Verifiability (tests) | | | | |
| Assumptions stated | | | | |
| Noise (2 = none) | | | | |
| **Total / 10** | | | | |

**Prompt length, in words:** A ____ · B ____ · C ____ · D ____

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)



```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
