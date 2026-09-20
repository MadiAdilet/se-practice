
def analyze_marks(marks, pass_mark=50):
    # Validate pass_mark
    if not isinstance(pass_mark, (int, float)) or isinstance(pass_mark, bool):
        raise ValueError("pass_mark must be a number")

    if not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be between 0 and 100")

    # Validate that marks is not empty
    if not marks:
        raise ValueError("Marks list cannot be empty")

    # Validate each mark
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("All marks must be numeric")

        if not 0 <= mark <= 100:
            raise ValueError("Marks must be between 0 and 100")

    # Calculate average
    average = sum(marks) / len(marks)

    # Find highest and lowest
    highest = max(marks)
    lowest = min(marks)

    # Count passing students
    passed = sum(mark >= pass_mark for mark in marks)

    # Calculate pass rate
    pass_rate = (passed / len(marks)) * 100

    # Return results
    return {
        "average": round(average, 2),
        "highest": highest,
        "lowest": lowest,
        "pass_rate": round(pass_rate, 2)
    }


# -------------------------
# Tests
# -------------------------

# 1. Basic example
print(analyze_marks([40, 60, 80], 50))

# 2. One mark
print(analyze_marks([75]))

# 3. Decimals
print(analyze_marks([65.5, 72.5, 80.0]))

# 4. Custom pass_mark
print(analyze_marks([40, 60, 80], 70))

# 5. Empty list
try:
    print(analyze_marks([]))
except ValueError as e:
    print("Error:", e)

# 6. Text value
try:
    print(analyze_marks([50, "abc", 80]))
except ValueError as e:
    print("Error:", e)

# 7. Mark below 0
try:
    print(analyze_marks([50, -5, 80]))
except ValueError as e:
    print("Error:", e)

# 8. Mark above 100
try:
    print(analyze_marks([50, 105, 80]))
except ValueError as e:
    print("Error:", e)