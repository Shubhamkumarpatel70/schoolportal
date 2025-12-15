import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-white/90">
              Learn more about our mission and values
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-neutral-1">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <FiTarget className="text-5xl text-secondary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4 text-neutral-3">Our Mission</h2>
                <p className="text-lg text-neutral-3/70">
                  To provide quality education that empowers students to achieve their full potential
                  and become responsible citizens of the world.
                </p>
              </div>

              <div className="text-center mb-12">
                <FiEye className="text-5xl text-secondary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4 text-neutral-3">Our Vision</h2>
                <p className="text-lg text-neutral-3/70">
                  To be a leading educational institution recognized for academic excellence,
                  innovation, and commitment to student success.
                </p>
              </div>

              <div className="text-center mb-12">
                <FiHeart className="text-5xl text-accent mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4 text-neutral-3">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-neutral-2 p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-2 text-neutral-3">Excellence</h3>
                    <p className="text-neutral-3/70">
                      Striving for the highest standards in everything we do
                    </p>
                  </div>
                  <div className="bg-neutral-2 p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-2 text-neutral-3">Integrity</h3>
                    <p className="text-neutral-3/70">
                      Acting with honesty and ethical principles
                    </p>
                  </div>
                  <div className="bg-neutral-2 p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg mb-2 text-neutral-3">Innovation</h3>
                    <p className="text-neutral-3/70">
                      Embracing new ideas and technologies
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* From the Desk of Director/Principal */}
        <section className="py-16 bg-neutral-2">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-neutral-1 p-8 md:p-12 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-neutral-3 mb-4">From the Desk of Principal</h2>
                  <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                    P
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-neutral-3 mb-2">Principal Name</h3>
                    <p className="text-neutral-3/70 mb-4 italic">Principal, School Portal</p>
                    <p className="text-neutral-3/70 leading-relaxed mb-4">
                      "Welcome to our school portal! It is with great pleasure that I extend my warmest greetings 
                      to all students, parents, teachers, and staff members. Our institution has always been 
                      committed to providing quality education and fostering an environment where every student 
                      can thrive and achieve their full potential."
                    </p>
                    <p className="text-neutral-3/70 leading-relaxed">
                      "Through this portal, we aim to enhance communication, streamline administrative processes, 
                      and provide easy access to important information. I encourage everyone to make full use of 
                      this platform to stay connected and engaged with our school community."
                    </p>
                    <p className="text-neutral-3/70 mt-4 font-semibold">
                      - Principal Name
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;

