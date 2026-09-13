raw_marks = "88, 47, -5, 101, abc, 73, 50, , 100"
valid_marks = []
for item in raw_marks:
    try:
        num = float(item)   
        if 0 <= num <= 100:
            valid_marks.append(num)
    except:
        pass  
if len(valid_marks) == 0:
    print("Нет валидных оценок")
    
else:
    count = len(valid_marks)
    average = sum(valid_marks) / count
    highest = max(valid_marks)
    lowest = min(valid_marks)
    passing = [m for m in valid_marks if m >= 50]
    pass_rate = len(passing) / count * 100
    print(f"Количество валидных оценок: {count}")
    print(f"Средняя оценка: {average:.2f}") 
    print(f"Максимальная оценка: {highest}")
    print(f"Минимальная оценка: {lowest}")
    print(f"Количество сдавших: {len(passing)}")
    print(f"Процент сдачи: {pass_rate:.2f}%")

