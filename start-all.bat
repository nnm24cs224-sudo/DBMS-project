dbms project commands are
step1:cd backend
node server.js

step2:cd frontend
npm run dev

step3:cd backend
node -e "import('better-sqlite3').then(({default: D}) => { const db = new D('attendance.db'); console.table(db.prepare('SELECT a.id, s.name as student, sub.subject_name as subject, a.date, a.status FROM attendance a JOIN students s ON a.student_id=s.id JOIN subjects sub ON a.subject_id=sub.id').all()); })"

