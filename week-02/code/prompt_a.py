
raw_marks = "88, 47, -5, 101, abc, 73, 50, , 100"

# Split the string into separate marks
marks = raw_marks.split(",")

valid_marks = []

# Check each mark
for item in marks:
    try:
        num = float(item.strip())

        # Accept marks only from 0 to 100
        if 0 <= num <= 100:
            valid_marks.append(num)

    except ValueError:
        pass

# Analyze valid marks
if len(valid_marks) > 0:
    count = len(valid_marks)
    average = sum(valid_marks) / count
    maximum = max(valid_marks)
    minimum = min(valid_marks)

    # Count students who passed (50 or more)
    passed = 0

    for mark in valid_marks:
        if mark >= 50:
            passed += 1

    pass_rate = (passed / count) * 100

    print("Valid marks:", valid_marks)
    print("Number of students:", count)
    print("Average mark:", round(average, 2))
    print("Highest mark:", maximum)
    print("Lowest mark:", minimum)
    print("Passed students:", passed)
    print("Pass rate:", round(pass_rate, 2), "%")

else:
    print("No valid marks found.")