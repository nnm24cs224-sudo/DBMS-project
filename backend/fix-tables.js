import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixTables() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      connectTimeout: 30000
    });

    console.log('✓ Connected!');
    console.log('Dropping old tables...\n');

    
    await connection.query('DROP TABLE IF EXISTS attendance');
    console.log('✓ Dropped attendance table');
    
    await connection.query('DROP TABLE IF EXISTS students');
    console.log('✓ Dropped students table');
    
    await connection.query('DROP TABLE IF EXISTS subjects');
    console.log('✓ Dropped subjects table');

    console.log('\nCreating new tables with correct structure...\n');

    
    await connection.query(`
      CREATE TABLE students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        usn VARCHAR(20) NOT NULL UNIQUE,
        department VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Students table created');

    
    await connection.query(`
      CREATE TABLE subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject_name VARCHAR(100) NOT NULL,
        subject_code VARCHAR(20) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Subjects table created');

    // Create attendance table
    await connection.query(`
      CREATE TABLE attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        subject_id INT NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Attendance table created');

    console.log('\n✅ All tables fixed successfully!\n');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

fixTables();
