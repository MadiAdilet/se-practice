# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Madi Adilet
**Group:** Monday 16-19
**Date:** 20.09.2026

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT |
| Exact model name | GPT-6 Astra |
| Implementation language | Python |
| Date of the runs | 20.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
n/a — used Python
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

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

**Is the function named `analyze_marks` with the required signature?** no — there is no function at all; the code runs at top level.

**First impression before testing** (one sentence — you will compare this with section 6 later):

It looks like a working demo script, but it is not a reusable function and will probably fail the harness.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

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

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?
8 tests, written as print() calls (the invalid-input ones inside try/except), not as assert.

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes ([75]) |
| decimals | yes ([65.5, 72.5, 80.0]) |
| custom pass_mark | yes (pass_mark=70) |
| empty list | yes |
| text value | yes ([50, "abc", 80]) |
| below 0 / above 100 | yes, two separate tests (-5 and 105) |

**Do the AI's own tests pass against the AI's own code?** yes.
Running prompt_c.py directly printed all 8 test lines with no crash: the results matched the
expected values and the four invalid inputs printed "Error: ...". Caveat: the tests only print
output and contain no assert, so they cannot fail. "Pass" here means only "no unexpected exception".

**Do they agree with the harness in section 6?** yes.
The AI's own tests and the harness both show correct behaviour: 6 PASS · 0 FAIL · 0 ERROR.
No disagreement. Note: this is not evidence of correctness by itself, because the AI's tests only
print. The independent harness is what confirms it.

**Assumptions C stated explicitly before the code:**

- Marks must be numbers (int or float) between 0 and 100, inclusive.
- pass_mark defaults to 50 and must be between 0 and 100 (extra, not requested: validated, ValueError otherwise).
- A student passes if their mark is >= pass_mark.
- An empty list raises ValueError.
- Text values and invalid marks raise ValueError.
- The pass rate is rounded to 2 decimal places.

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
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
```

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

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1 | Nothing returned or raised: file has no analyze_marks, harness printed "defines no callable named 'analyze_marks'" and exited before running the case |
| A | 2 | same as case 1 |
| A | 3 | same as case 1 |
| A | 4 | same as case 1 |
| A | 5 | same as case 1 |
| A | 6 | same as case 1 |

B, C, D: no FAIL and no ERROR, all 18 cases PASS, so no rows are needed.

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
Valid marks: [88.0, 47.0, 73.0, 50.0, 100.0]
Number of students: 5
Average mark: 71.6
Highest mark: 100.0
Lowest mark: 47.0
Passed students: 4
Pass rate: 80.0 %
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
{'average': 71.6, 'highest': 100, 'lowest': 47, 'pass_rate': 80.0}
========================================================================
analyze_marks harness — code\prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code\prompt_b.py)
========================================================================
```

**Prompt C**

```
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}
{'average': 75.0, 'highest': 75, 'lowest': 75, 'pass_rate': 100.0}
{'average': 72.67, 'highest': 80.0, 'lowest': 65.5, 'pass_rate': 100.0}
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 33.33}
Error: Marks list cannot be empty
Error: All marks must be numeric
Error: Marks must be between 0 and 100
Error: Marks must be between 0 and 100
========================================================================
analyze_marks harness — code\prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code\prompt_c.py)
========================================================================
```

**Prompt D**

```
========================================================================
analyze_marks harness — code\prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Marks must contain only numeric values
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code\prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 1 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 1 | 1 | 2 |
| **Total / 10** | 0 | 6 | 8 | 10 |

**Prompt length, in words:** A 7 · B 44 · C 84 · D 131

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

| Step | Words added | Points gained | Words per point |
| --- | --- | --- | --- |
| B over A | +37 | +6 | ≈ 6 |
| C over B | +40 | +2 | ≈ 20 |
| D over C | +47 | +2 | ≈ 24 |

The first 37 words (A to B) bought all the correctness (0/6 to 6/6); the next words bought only tests, stated assumptions and less noise, at about 20–24 words per point, and no extra passing cases.

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
Prompt D scored best (10/10, against C 8, B 6, A 0), and I would use a D-style prompt at work, because it is the only one whose tests actually check something. But on correctness, B, C and D are identical: all three pass 6/6. The single addition that bought the most correctness was the signature and return shape in Prompt B: Prompt A defined no analyze_marks at all, so case 1 went from ERROR to PASS, and so did cases 2–6. The next 87 words changed no verdict; they bought verifiability, not correctness. Pure noise: B's module-level print, which runs on import, and C's eight print-only tests, which cannot fail, plus its expected-results table. The ambiguity was rounding. The spec says pass_rate 66.67, but B returned 66.66666666666666 in case 1; the harness still gave PASS because its tolerance is 0.01. C and D returned 66.67. In D I required two decimals and stated that a mark equal to pass_mark passes (>=), which case 3, [49.5, 50], depends on.
```

**Word count:** 169

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. B, C and D all passed 6/6, so the harness could not tell them apart on correctness. What behaviour
   does it not test (for example True/False as marks, NaN or infinity, or an invalid pass_mark such as
   a string) where B, C and D might actually differ?

2. B returned pass_rate=66.66666666666666 in case 1 and still got PASS because the tolerance is 0.01.
   Should a function round its result itself (as C and D did), or should rounding be left to the code
   that displays it, and does a tolerance in the test hide a real requirement?