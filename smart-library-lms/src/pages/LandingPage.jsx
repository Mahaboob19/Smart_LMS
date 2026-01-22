// pages/LandingPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { authAPI } from '../api/auth';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (authAPI.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;