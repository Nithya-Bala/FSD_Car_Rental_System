// About.js
import React from "react";
import "./page_css/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">About Us</h1>

        <p className="about-text">
          <strong>DriveMate Rentals</strong> is a trusted and innovative car rental platform founded with the vision of making car rentals seamless, affordable, and reliable for everyone. With a customer-first approach, we offer a broad fleet of well-maintained vehicles suited for both personal and professional needs.
        </p>

        <h3 className="about-subtitle">Our Mission</h3>
        <p className="about-text">
          To redefine urban mobility by delivering top-quality car rental services that combine convenience, safety, and affordability — empowering users to explore more, worry less.
        </p>

        <h3 className="about-subtitle">Our Vision</h3>
        <p className="about-text">
          To become the most preferred car rental company in India by leveraging technology and customer-centric service.
        </p>

        <h3 className="about-subtitle">What We Offer</h3>
        <ul className="about-list">
          <li> Diverse vehicle options: hatchbacks, sedans, SUVs, luxury cars</li>
          <li>Flexible leasing: daily, weekly, monthly plans</li>
          <li>Instant booking & real-time availability</li>
          <li>Safe & sanitized rides</li>
          <li>Transparent pricing with no hidden charges</li>
          <li>Round-the-clock support</li>
        </ul>

        <h3 className="about-subtitle">Our Story</h3>
        <p className="about-text">
          Founded in 2025 by a group of automobile and tech enthusiasts, DriveMate Rentals began as a college project and quickly transformed into a fast-growing startup. Today, we serve thousands of customers every month and continue to expand our vehicle offerings and reach.
        </p>

        <h3 className="about-subtitle">Our Core Values</h3>
        <ul className="about-list">
          <li>Integrity & Trust</li>
          <li>Innovation & Excellence</li>
          <li>Customer Delight</li>
          <li>Environmental Responsibility</li>
          <li>Safety First</li>
        </ul>

        <p className="about-text mt-4">
          Thank you for choosing DriveMate Rentals. We’re here to help you drive your journey with ease and comfort.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
