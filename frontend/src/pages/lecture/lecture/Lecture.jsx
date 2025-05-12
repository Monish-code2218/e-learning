import React, { useEffect, useState, useCallback } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../../main";
import Loading from "../../../components/loading/Loading";
import toast from "react-hot-toast";
import { CourseData } from "../../../context/CourseContext";

const Lecture = ({ user }) => {

  const [lecture, setLecture] = useState([]);
  const params = useParams();
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const { id: _id } = useParams();

  const { fetchCourse, course, } = CourseData();
  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  // Fetch a single lecture
  const fetchLecture = async () => {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/single/${_id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLecture(data.lecture);
    } catch (error) {
      console.error("Error fetching lecture:", error);
      toast.error(error.response?.data?.message || "Error fetching lecture");
    } finally {
      setLecLoading(false);
    }
  };

  // Handle video file change
  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setVideoPrev(reader.result);
        setVideo(file);
      };
    }
  };

  // Submit new lecture
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!video) {
      toast.error("Please upload a video");
      return;
    }

    setBtnLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", video);

    try {
      const { data } = await axios.post(`${server}/api/`, formData, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);

      setShow(false);
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPrev("");
    } catch (error) {
      console.error("Error adding lecture:", error);
      toast.error(error.response?.data?.message || "Error adding lecture");
    } finally {
      setBtnLoading(false);
    }
  };

  // Delete a lecture
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    try {
      const { data } = await axios.delete(`${server}/api/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);

    } catch (error) {
      console.error("Error deleting lecture:", error);
      toast.error(error.response?.data?.message || "Error deleting lecture");
    }
  };

  // Fetch lectures on component mount
  useEffect(() => {
    fetchLecture();
  }, []);

  return (
    <>


      {course && (
        <div className="lecture-page">
          <div className="left">
            <img
              src={`${course.image}`}
              alt="Course thumbnail"
            />
          </div>
          <div className="lecture-content">
            <h1>{lecture.title}</h1>
            <h3>{lecture.description}</h3>
            <a href={lecture.video} >Click this link to study</a>
          </div>
        </div>
      )}





      {/* Right Section: Lecture List & Admin Panel */}
      <div className="right">
        {user?.role === "admin" && (
          <button className="common-btn" onClick={() => setShow(!show)}>
            {show ? "Close" : "Add Lecture +"}
          </button>
        )}

        {show && (
          <div className="lecture-form">
            <h2>Add Lecture</h2>
            <form onSubmit={submitHandler}>
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <label>Upload Video</label>
              <input type="file" accept="video/*" onChange={changeVideoHandler} required />

              {videoPrev && <video src={videoPrev} width={300} controls />}

              <button disabled={btnLoading} type="submit" className="common-btn">
                {btnLoading ? "Please Wait..." : "Add"}
              </button>
            </form>
          </div>
        )}

        {/* Lecture List */}
        <div className="lecture-list">
          {Array.isArray(lecture) && lecture.length > 0 ? (
            lecture.map((e, i) => (
              <div key={e._id || i}>
                <div
                  onClick={() => fetchLecture(e._id)}
                  className={`lecture-number ${lecture?._id === e._id ? "active" : ""}`}
                >
                  {i + 1}. {e.title}
                </div>
                {user?.role === "admin" && (
                  <button
                    className="common-btn"
                    style={{ background: "red", marginTop: "5px" }}
                    onClick={() => deleteHandler(e._id)}
                  >
                    Delete {e.title}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>


    </>
  );
};

export default Lecture;
