import React, { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";

const CourseStudy = ({ user }) => {
  const params = useParams();
 

  const { fetchCourse, course } = CourseData();
  const navigate = useNavigate();

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  useEffect(() => {
    fetchCourse(params.id);
  }, []);
  return (
    <>
      {course && (
        <div className="course-study-page">
          <img src={`${course.image}`} alt="" width={350} />
          <h2>{course.title}</h2>
          <h4>{course.description}</h4>
          {user && user.subscription && user.subscription.includes(course._id) ? (
            <button
              onClick={() => navigate(`/course/lecture/${course._id}`)}
              className="common-btn"
            >
              Start Learning
            </button>
          ) : (
            <button
              onClick={() => navigate(`/payment/${course._id}`)}
              className="common-btn"
               
            >
              Buy Now!!
            </button>
          )}
          

        </div>
      )}
    </>
  );
};

export default CourseStudy;
