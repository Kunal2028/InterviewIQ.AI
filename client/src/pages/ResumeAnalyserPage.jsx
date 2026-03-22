import React from "react";
import ResumeAnalyser from "../components/ResumeAnalyser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { useState } from "react";
import AuthModel from "../components/AuthModel";

function ResumeAnalyserPage() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <div className="flex-1 px-6 py-20">
        <ResumeAnalyser
          userData={userData}
          setShowAuth={setShowAuth}
        />
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
 
    </div>
  );
}

export default ResumeAnalyserPage;