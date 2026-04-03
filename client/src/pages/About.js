import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiAward, FiBookOpen, FiEye, FiHeart, FiTarget, FiUsers } from 'react-icons/fi';

const About = () => {
  const values = [
    {
      title: 'Excellence',
      description: 'We set clear standards and continuously improve learning outcomes.'
    },
    {
      title: 'Integrity',
      description: 'We lead with transparency, respect, and accountability.'
    },
    {
      title: 'Innovation',
      description: 'We integrate modern tools to make education more engaging and effective.'
    }
  ];

  const highlights = [
    {
      title: 'Learner-Centric Curriculum',
      description: 'Academic plans are structured around comprehension, consistency, and confidence.',
      icon: FiBookOpen
    },
    {
      title: 'Mentor-Led Guidance',
      description: 'Teachers and coordinators actively support each student’s personal growth plan.',
      icon: FiUsers
    },
    {
      title: 'Performance Transparency',
      description: 'Families receive timely updates through a clear and centralized communication flow.',
      icon: FiAward
    }
  ];

  return (
    <div className="ui-shell">
      <Header />

      <div className="flex-grow">
        <section className="ui-hero">
          <div className="ui-container relative text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">About Our Institution</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 sm:text-lg">
              Building confident learners through discipline, innovation, and strong academic support.
            </p>
          </div>
        </section>

        <section className="ui-section">
          <div className="ui-container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <article className="ui-card p-7 sm:p-8">
                <FiTarget className="text-4xl text-secondary" />
                <h2 className="mt-5 text-2xl font-bold text-slate-900">Our Mission</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  To deliver high-quality education that empowers students to reach their full potential and become
                  responsible citizens.
                </p>
              </article>

              <article className="ui-card p-7 sm:p-8">
                <FiEye className="text-4xl text-secondary" />
                <h2 className="mt-5 text-2xl font-bold text-slate-900">Our Vision</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  To be a benchmark institution recognized for academic excellence, student wellbeing, and future-ready
                  learning practices.
                </p>
              </article>
            </div>

            <div className="mt-6 ui-card p-7 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <FiHeart className="text-3xl text-accent" />
                <h2 className="text-2xl font-bold text-slate-900">Our Core Values</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {values.map((value) => (
                  <div key={value.title} className="ui-card-soft p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{value.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="ui-card ui-fade-up p-6"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <Icon className="text-3xl text-secondary" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="ui-section pt-2">
          <div className="ui-container">
            <article className="ui-card overflow-hidden">
              <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4 sm:px-10">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                  <FiAward className="text-secondary" />
                  From the Principal's Desk
                </h2>
              </div>
              <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-10">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-white sm:mx-0 sm:h-28 sm:w-28">
                  P
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Principal Name</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">Principal, School Portal</p>
                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    Welcome to our digital campus platform. We are committed to building an environment where every
                    learner can grow academically and personally with confidence.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    This portal strengthens communication between families, teachers, and administration while giving
                    students faster access to notices, events, and academic updates.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;

