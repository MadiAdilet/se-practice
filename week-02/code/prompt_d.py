# Assumptions:
# - marks must be a non-empty list of numeric values.
# - Boolean values are treated as non-numeric.
# - Each mark must be between 0 and 100, inclusive.
# - pass_mark is assumed to be a numeric value.
# - Passing marks are greater than or equal to pass_mark.


def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("Marks list cannot be empty")

    valid_marks = []

    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("Marks must contain only numeric values")

        if mark < 0 or mark > 100:
            raise ValueError("Marks must be between 0 and 100")

        valid_marks.append(mark)

    average = round(sum(valid_marks) / len(valid_marks), 2)
    highest = max(valid_marks)
    lowest = min(valid_marks)

    passed_count = sum(mark >= pass_mark for mark in valid_marks)
    pass_rate = round((passed_count / len(valid_marks)) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }


# Tests

# One mark
assert analyze_marks([75]) == {
    "average": 75.0,
    "highest": 75,
    "lowest": 75,
    "pass_rate": 100.0
}

# Decimals
assert analyze_marks([50.5, 60.5, 70.5]) == {
    "average": 60.5,
    "highest": 70.5,
    "lowest": 50.5,
    "pass_rate": 100.0
}

# Custom pass_mark
assert analyze_marks([40, 60, 80], 70) == {
    "average": 60.0,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 33.33
}

# Empty list
try:
    analyze_marks([])
    assert False
except ValueError:
    pass

# Text value
try:
    analyze_marks([40, "abc", 80])
    assert False
except ValueError:
    pass

# Marks below 0
try:
    analyze_marks([-5, 50, 80])
    assert False
except ValueError:
    pass

# Marks above 100
try:
    analyze_marks([50, 101, 80])
    assert False
except ValueError:
    pass