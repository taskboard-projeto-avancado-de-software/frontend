import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SplashScreen.css";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/listar");
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <h1 className="splash-title">Taskboard</h1>
      <p className="splash-subtitle">
        Organize sua vida, simplifique seus dias.
      </p>
    </div>
  );
};

export default SplashScreen;
