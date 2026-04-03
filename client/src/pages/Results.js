import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { formatDateDDMMYYYY } from '../utils/date';
import { FiAward, FiSearch } from 'react-icons/fi';

const Results = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/classes`);
      setClasses(res.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleViewResults = async () => {
    if (!selectedClass) {
      setFeedback('Please select a class before searching.');
      return;
    }
    setFeedback('');
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/examResults/class/${selectedClass}`);
      setResults(res.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Group results by exam type and date
  const groupedResults = results.reduce((acc, result) => {
    const key = `${result.examType}_${result.examDate}`;
    if (!acc[key]) {
      acc[key] = {
        examType: result.examType,
        examDate: result.examDate,
        addedBy: result.addedBy?.name || 'Unknown',
        remarks: result.remarks,
        results: []
      };
    }
    acc[key].results.push(result);
    return acc;
  }, {});

  const filteredGroupedResults = Object.values(groupedResults).map((group) => ({
    ...group,
    results: group.results.filter((item) => {
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;
      return (
        item.studentName?.toLowerCase().includes(query)
        || item.rollNumber?.toLowerCase().includes(query)
      );
    })
  })).filter((group) => group.results.length > 0);

  const allVisibleResults = filteredGroupedResults.flatMap((group) => group.results);
  const averageScore = allVisibleResults.length
    ? Math.round(allVisibleResults.reduce((acc, item) => acc + (item.examPercent || 0), 0) / allVisibleResults.length)
    : 0;
  const passRate = allVisibleResults.length
    ? Math.round((allVisibleResults.filter((item) => item.examPercent >= 40).length / allVisibleResults.length) * 100)
    : 0;

  return (
    <div className="ui-shell">
      <Header />

      <div className="flex-grow">
        <section className="ui-hero">
          <div className="ui-container relative text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Exam Results</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/90 sm:text-lg">
              Search and review published examination results by class.
            </p>
          </div>
        </section>

        <section className="ui-section">
          <div className="ui-container">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <FiAward className="mx-auto text-5xl text-secondary" />
              </div>

              <div className="ui-card mb-8 p-6 sm:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="w-full flex-1">
                    <label className="ui-label">Select Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="ui-select"
                    >
                      <option value="">-- Select Class --</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls.className}>
                          {cls.className} {cls.section ? `- ${cls.section}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-72">
                    <label className="ui-label">Search Student / Roll</label>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="ui-input"
                      placeholder="Type name or roll number"
                    />
                  </div>
                  <button
                    onClick={handleViewResults}
                    disabled={loading || !selectedClass}
                    className="ui-btn-primary w-full md:w-auto"
                  >
                    <FiSearch />
                    <span>{loading ? 'Loading...' : 'View Results'}</span>
                  </button>
                </div>
                {feedback && <p className="mt-3 text-sm font-medium text-red-600">{feedback}</p>}
              </div>

              {results.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <article className="ui-stat-card">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Students Visible</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{allVisibleResults.length}</p>
                    </article>
                    <article className="ui-stat-card">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average Score</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{averageScore}%</p>
                    </article>
                    <article className="ui-stat-card">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pass Rate</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{passRate}%</p>
                    </article>
                  </div>

                  {filteredGroupedResults.map((group, groupIndex) => (
                    <div key={groupIndex} className="ui-card overflow-hidden">
                      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold capitalize text-slate-900">
                            {group.examType.replace('-', ' ')} Exam
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            Date: {formatDateDDMMYYYY(group.examDate)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">Added by: {group.addedBy}</p>
                        </div>
                        {group.remarks && <p className="text-sm italic text-slate-600">{group.remarks}</p>}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-primary text-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold">S.No</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Roll No</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Student Name</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Percentage</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.results
                              .sort((a, b) =>
                                a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })
                              )
                              .map((result, index) => {
                                const getGrade = (percent) => {
                                  if (percent >= 90) return 'A+';
                                  if (percent >= 80) return 'A';
                                  if (percent >= 70) return 'B+';
                                  if (percent >= 60) return 'B';
                                  if (percent >= 50) return 'C+';
                                  if (percent >= 40) return 'C';
                                  return 'F';
                                };

                                return (
                                  <tr key={result._id} className="border-b border-slate-100">
                                    <td className="px-4 py-3 text-sm text-slate-700">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{result.rollNumber}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{result.studentName}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{result.examPercent}%</td>
                                    <td className="px-4 py-3 text-sm">
                                      <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                          result.examPercent >= 50
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}
                                      >
                                        {getGrade(result.examPercent)}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedClass && !loading ? (
                <div className="ui-card p-12 text-center">
                  <p className="text-base text-slate-600">No results found for this class or search query.</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Results;

