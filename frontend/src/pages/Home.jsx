function Home() {
  return (
    <div className="home">
      <h1>Welcome to College Management System</h1>
      <p>Manage students, subjects, and attendance efficiently</p>
      
      <div className="features">
        <div className="feature-card">
          <h3>Student Management</h3>
          <p>Add, view, and manage student records with ease</p>
        </div>
        <div className="feature-card">
          <h3>Subject Management</h3>
          <p>Organize and track all subjects and courses</p>
        </div>
        <div className="feature-card">
          <h3>Attendance Tracking</h3>
          <p>Record and monitor student attendance efficiently</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
