# Week 01 — Rocket (AI app builder) — Prompt Log

## 1. Initial prompt (exact, one line, as given in README)

Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

## 2. Questions Rocket asked

How will marks be entered into the tool?
Who is this tool for?

## 3. My answers to those questions

Paste a list at once (Drop a comma-separated or line-by-line list of marks)
Personal or learning use (A developer or student building this for practice or self-use)

## 4. Rocket's rewritten / enhanced prompt

A lightweight, personal web-based student marks processor where you paste a list of marks and instantly see the computed average, highest score, lowest score, and pass rate displayed on screen. The interface is clean and single-purpose — paste your marks, hit process, and get the results

## 5. What Rocket added that I never asked for

- Configurable pass threshold (slider, default 50%) — spec requires a fixed ≥50 rule
- Web UI with input box, sliders, cards — I only asked for "prints" the stats (implies console output)
- Six stat cards including "Passed" / "Failed" counts — spec only needs pass rate %
- Mark distribution histogram (bar chart)
- Sorted, color-coded "Parsed Marks" chips
- "Invalid entries" detection callout

## 6. Testing with the four spec test cases

### Case A: 85, 23, 45, 90, 92
- Rocket output: <впишите>
- Spec expects: avg 67.00 · high 92 · low 23 · pass 60.0%
- Match: yes/no

### Case B: 88, 47, -5, 101, abc, 73, 50, , 100
- Rocket output (before fix): no result shown / app hung — see screenshot
- Rocket output (after fix): <впишите>
- Spec expects: avg 71.60 · high 100 · low 47 · pass 80.0%
- Match: yes/no

### Case C: 10, 20, 30
- Rocket output: <впишите>
- Spec expects: avg 20.00 · high 30 · low 10 · pass 0.0%
- Match: yes/no

### Case D: abc, , xyz
- Rocket output: <впишите — показало ли понятное сообщение, или сломалось>
- Spec expects: clear message, no crash
- Match: yes/no

## 7. Defect found and fix attempt

**Defect found:** With input `88, 47, 23, 32, 101, -5`, Rocket counted 5 valid
marks instead of 4, and reported Highest: 101 (out of the allowed 0–100 range).
It correctly rejected negative numbers (-5) but failed to reject numbers above
100 (101) — an incomplete upper-bound validation.

**Prompt used to fix it:**
The app treats marks above 100 as valid. For example, entering
88, 47, 23, 32, 101, -5 shows "5 marks processed" and Highest: 101,
but 101 is outside the valid 0-100 range and should be excluded.
Only marks where 0 <= mark <= 100 should count as valid. Please fix
the validation so marks above 100 are rejected the same way negative
marks already are.

**Result:** Fixed. Valid count changed from 5 → 4, Highest changed from
101 → 88, Average recalculated correctly to 47.50 (was 58.20). Nothing
else appeared to break.