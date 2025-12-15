import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { FiAward, FiSearch } from 'react-icons/fi';

const Results = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/classes');
      setClasses(res.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleViewResults = async () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/examResults/class/${selectedClass}`);
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

  return (
    <div className="min-h-screen flex flex-col bg-neutral-1">
      <Header />
      
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <FiAward className="text-5xl text-secondary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-neutral-3 mb-2">Exam Results</h1>
              <p className="text-neutral-3/70">View examination results by class</p>
            </div>

            {/* Class Selection */}
            <div className="bg-neutral-2 rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-neutral-3 font-semibold mb-2">Select Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="">-- Select Class --</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls.className}>
                        {cls.className} {cls.section ? `- ${cls.section}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleViewResults}
                  disabled={loading || !selectedClass}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FiSearch />
                  <span>{loading ? 'Loading...' : 'View Results'}</span>
                </button>
              </div>
            </div>

            {/* Results Display */}
            {results.length > 0 ? (
              <div className="space-y-6">
                {Object.values(groupedResults).map((group, groupIndex) => (
                  <div key={groupIndex} className="bg-neutral-2 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-1">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-3 capitalize">{group.examType.replace('-', ' ')} Exam</h3>
                        <p className="text-sm text-neutral-3/70">
                          Date: {new Date(group.examDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-neutral-3/50 mt-1">
                          Added by: {group.addedBy}
                        </p>
                      </div>
                      {group.remarks && (
                        <p className="text-sm text-neutral-3/70 italic">{group.remarks}</p>
                      )}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-primary text-white">
                          <tr>
                            <th className="px-4 py-3 text-left">S.No</th>
                            <th className="px-4 py-3 text-left">Roll No</th>
                            <th className="px-4 py-3 text-left">Student Name</th>
                            <th className="px-4 py-3 text-left">Percentage</th>
                            <th className="px-4 py-3 text-left">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.results.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })).map((result, index) => {
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
                              <tr key={result._id} className="border-b border-neutral-1">
                                <td className="px-4 py-3 text-neutral-3">{index + 1}</td>
                                <td className="px-4 py-3 text-neutral-3">{result.rollNumber}</td>
                                <td className="px-4 py-3 text-neutral-3">{result.studentName}</td>
                                <td className="px-4 py-3 text-neutral-3 font-semibold">{result.examPercent}%</td>
                                <td className="px-4 py-3">
                                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                                    result.examPercent >= 50 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
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
              <div className="bg-neutral-2 rounded-lg shadow-md p-12 text-center">
                <p className="text-neutral-3/70 text-lg">No results found for this class</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Results;

