import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./paymentsuccess.css";

const PaymentSuccess = () => {
  const { id: _id } = useParams();
  const [lectures, setLectures] = useState([]); // Always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Lecture Data
  const fetchLecture = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://e-learning-8p1n.onrender.com/api/single/${_id}`);
      console.log("API Response:", response.data); // Debug API data
      // Ensure response is always an array
      setLectures([response.data.lecture]);
    } catch (err) {
      console.error("Error fetching lecture:", err);
      setError("Failed to load lectures. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecture();
  }, []); // Depend on _id to refetch when it changes

  return (
    <div className="payment-success-page">
      <div className="success-message">
        <h2>Payment Successful</h2>
        <p>on this course </p>

        {/* Loading State */}
        {loading && <p>Loading lectures...</p>}

        {/* Error State */}
        {error && <p className="error-message">{error}</p>}

        {/* Render Lectures Only If Available */}

        {!loading && !error && lectures.length > 0 ? (
          lectures.map((lecture) => (
            <div key={lecture._id} className="">
              
              <h3>{lecture.title}</h3>
              <p>{lecture.description}</p>
              <Link to={`/course/lecture/${lecture._id}`} className="common-btn">
                View Course
              </Link>
            </div>
          ))
        ) : (
          !loading && <p>No lectures available.</p>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;
