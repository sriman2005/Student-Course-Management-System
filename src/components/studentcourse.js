import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './studentcourse.css'; // Import the CSS file for styling

function ViewCourses() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [additionalData, setAdditionalData] = useState(null);

    useEffect(() => {
        fetchStudentCourses();
    }, []);

    const fetchStudentCourses = () => {
        const url = "http://localhost:5000/studentcourse"; // Endpoint to fetch student course data
        Axios.get(url)
            .then(res => {
                setCourses(res.data);
            })
            .catch(err => {
                console.error("Error fetching student courses:", err);
                setError("Failed to fetch student course data");
            });
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setAdditionalData(null); // Clear additional data when a new course is selected
    };

    const handleSubmit = () => {
        // Write the desired data when submit is clicked
        setAdditionalData("MERN stack is a popular JavaScript framework used for building web applications. It is an acronym for MongoDB, Express.js, React, and Node.js. Each component of the stack plays a specific role in the development process.");
    };

    return (
        <div className='full-height'>
            <h3>Courses Selected</h3>
            {error && <p className="error-message">{error}</p>}
            <table className='tablestyle'>
                <thead>
                    <tr>
                        <th className='firstcolumn'>Course Name</th>
                        <th>Section Number</th>
                        <th>Faculty Name</th>
                        <th>Semester</th>
                        <th>Year</th>
                        <th>View Courses</th> {/* New column for the button */}
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={index} onClick={() => handleCourseClick(course)} className={selectedCourse === course ? 'selected' : ''}>
                            <td>{course.course}</td>
                            <td>{course.sectionNumber}</td>
                            <td>{course.facultyName}</td>
                            <td>{course.semester}</td>
                            <td>{course.academicYear}</td>
                            <td><button onClick={handleSubmit}>View</button></td> {/* Button in the new column */}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {additionalData && (
                <div className="additional-info">
                    {/* Display additional data here */}
                    <p>{additionalData}</p>
                </div>
            )}
        </div>
    );
}

export default ViewCourses;
