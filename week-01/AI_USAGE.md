AI Usage Disclosure — Week 01

Required by the course academic policy (Generative AI use level D — AI-integrated). You are responsible for the accuracy, testing and integrity of everything you submit, including anything an AI tool produced.

Tool	Version / plan	Used for	Which files it touched
Rocket (rocket.new)	free	Part 2 — generated a web app from a one-line prompt, iterated on it via clarifying questions and one follow-up bug-fix prompt	week-01/ai/
Claude (Anthropic)	claude.ai, web chat	Debugging support on Part 1 (my own manual Python code) — asked clarifying questions and pointed out bugs (unsplit input string, misindented print block, decimal formatting) without writing the code for me; 
Part 1 (week-01/manual/) was written without any AI assistance: yes

<!-- I wrote the code myself. I used Claude afterward to help debug by pointing out where my logic was wrong (e.g., iterating over a string instead of a list, print statements outside the else block, wrong decimal precision), but I made every fix myself and understand why each one was needed. -->

Everything I submitted, I can explain and defend in class: yes

<!-- For the manual Python solution, yes — I traced every test case by hand. For the Rocket app, I can explain what it does and where it went wrong (the range-validation bug, the misleading zero-output on empty input), but not the internal implementation, since I never reviewed its generated code. -->

Anything I accepted from the AI without fully understanding it: Rocket's generated source code itself — I tested it exclusively through the UI and verified its outputs against the spec, but I did not download or read the underlying implementation, so I cannot explain line-by-line how it computes the results or why the range-validation bug originally occurred internally.

Signed: Madi Adilet Date: 2026-09-13