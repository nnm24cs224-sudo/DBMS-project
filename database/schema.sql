
CREATE DATABASE IF NOT EXISTS college_db;
USE college_db;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  usn VARCHAR(20) NOT NULL UNIQUE,
  department VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_name VARCHAR(100) NOT NULL,
  subject_code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('Present', 'Absent') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Insert sample students
INSERT INTO students (name, usn, department) VALUES
('Rahul Sharma', 'CS001', 'Computer Science'),
('Priya Patel', 'EC001', 'Electronics'),
('Amit Kumar', 'ME001', 'Mechanical');


INSERT INTO subjects (subject_name, subject_code) VALUES
('Data Structures', 'CS201'),
('Database Management', 'CS202'),
('Web Development', 'CS203');


INSERT INTO attendance (student_id, subject_id, date, status) VALUES
(1, 1, '2024-03-01', 'Present'),
(2, 2, '2024-03-01', 'Present'),
(3, 3, '2024-03-01', 'Absent');
