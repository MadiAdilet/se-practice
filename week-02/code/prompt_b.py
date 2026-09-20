def analyze_marks(marks, pass_mark=50):
    # Check if the list is empty
    if not marks:
        raise ValueError("Marks list cannot be empty")

    # Validate all marks
    for mark in marks:
        if not isinstance(mark, (int, float)) or isinstance(mark, bool):
            raise ValueError("All marks must be numeric")

        if not 0 <= mark <= 100:
            raise ValueError("Marks must be between 0 and 100")

    # Calculate statistics
    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)

    # Count passing marks
    passed = sum(1 for mark in marks if mark >= pass_mark)
    pass_rate = (passed / len(marks)) * 100

    # Return results in a dictionary
    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }


# Example usage
marks = [88, 47, 73, 50, 100]

result = analyze_marks(marks)

print(result)