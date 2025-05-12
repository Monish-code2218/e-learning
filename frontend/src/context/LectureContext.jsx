import React, { createContext, useContext, useState } from "react";
import { server } from "../main";

const LectureContext = createContext();

export const LectureProvider = ({ children }) => {
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchLecture = async (courseId) => {
    try {
      setLoading(true);
      const response = await fetch(`${server}/api/single/${courseId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setLecture(data.lecture);
        setProgress(data.lecture.progress || 0);
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch lecture");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId, lectureId, progressValue) => {
    try {
      const response = await fetch(`${server}/api/v1/lecture/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ courseId, lectureId, progress: progressValue }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setProgress(progressValue);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Failed to update progress", err);
      setError(err.message || "Failed to update progress");
    }
  };

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <LectureContext.Provider
      value={{
        lecture,
        loading,
        error,
        progress,
        isPlaying,
        fetchLecture,
        updateProgress,
        togglePlayback,
      }}
    >
      {children}
    </LectureContext.Provider>
  );
};

export const useLecture = () => {
  return useContext(LectureContext);
};
