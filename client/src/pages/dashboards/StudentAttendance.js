import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { toDateKeyYMD } from "../../utils/date";
import { getMonthAttendanceSummary } from "../../utils/attendanceStats";

const SUNDAY_OVERRIDE_TITLE = "Sunday Attendance Enabled";

const StudentAttendance = ({ user }) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const loadAttendance = useCallback(async () => {
    const studentId = user?.studentId || user?._id;
    if (!studentId) return;
    setLoading(true);
    setError("");
    setHasFetched(true);
    try {
      const [attRes, holRes] = await Promise.all([
        axios.get(
          `${API_BASE_URL}/api/attendance/student/${studentId}?month=${month}&year=${year}`,
        ),
        axios.get(
          `${API_BASE_URL}/api/holidays?month=${month}&year=${year}`,
        ),
      ]);
      setAttendanceData(attRes.data || []);
      setHolidays(holRes.data || []);
    } catch (err) {
      setError("Failed to fetch attendance.");
      setAttendanceData([]);
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  }, [user, month, year]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const fetchAttendance = (e) => {
    e.preventDefault();
    loadAttendance();
  };

  const attendanceByDate = useMemo(() => {
    return (attendanceData || []).reduce((acc, rec) => {
      const key = toDateKeyYMD(rec.date);
      if (key) acc[key] = rec.status;
      return acc;
    }, {});
  }, [attendanceData]);

  const sundayEnabledOverrideDateSet = useMemo(
    () =>
      new Set(
        (holidays || [])
          .filter(
            (h) =>
              String(h?.title || "").trim().toLowerCase() ===
              SUNDAY_OVERRIDE_TITLE.toLowerCase(),
          )
          .map((h) => toDateKeyYMD(h.date))
          .filter(Boolean),
      ),
    [holidays],
  );

  const holidayByDate = useMemo(() => {
    return (holidays || []).reduce((acc, h) => {
      if (
        String(h?.title || "").trim().toLowerCase() ===
        SUNDAY_OVERRIDE_TITLE.toLowerCase()
      ) {
        return acc;
      }
      const key = toDateKeyYMD(h.date);
      if (key) acc[key] = h;
      return acc;
    }, {});
  }, [holidays]);

  const calendarHolidayByDate = useMemo(() => {
    const merged = { ...holidayByDate };
    const monthEnd = new Date(year, month, 0).getDate();
    for (let day = 1; day <= monthEnd; day += 1) {
      const dateObj = new Date(year, month - 1, day);
      if (dateObj.getDay() !== 0) continue;
      const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (sundayEnabledOverrideDateSet.has(dateKey)) continue;
      if (!merged[dateKey]) {
        merged[dateKey] = {
          _id: `sunday-${dateKey}`,
          title: "Sunday Holiday",
          date: dateKey,
          isWeeklyOff: true,
        };
      }
    }
    return merged;
  }, [holidayByDate, sundayEnabledOverrideDateSet, year, month]);

  const monthSummary = useMemo(
    () =>
      getMonthAttendanceSummary(
        year,
        month,
        attendanceByDate,
        calendarHolidayByDate,
      ),
    [year, month, attendanceByDate, calendarHolidayByDate],
  );

  const calendarCells = useMemo(() => {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    const daysInMonth = monthEnd.getDate();
    const startWeekday = monthStart.getDay();
    const cells = [];
    for (let i = 0; i < startWeekday; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
    return cells;
  }, [month, year]);

  const monthLabel = new Date(year, month - 1, 1).toLocaleString("default", {
    month: "long",
  });

  return (
    <div>
      <form
        className="flex flex-wrap gap-4 items-end mb-6"
        onSubmit={fetchAttendance}
      >
        <div>
          <label className="block mb-1 text-sm">Month</label>
          <select
            className="border rounded px-3 py-2"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            required
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Year</label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-28"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="2000"
            max={new Date().getFullYear() + 5}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Fetch Attendance
        </button>
      </form>

      {loading && <p className="text-neutral-3/70">Loading attendance...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {hasFetched && !loading && (
        <div className="space-y-4">
          <div className="bg-neutral-2 rounded-lg border border-neutral-1 p-4 shadow-sm">
            <p className="text-sm font-semibold text-neutral-3 mb-2">
              Summary ({monthLabel} {year})
            </p>
            <p className="text-xs text-neutral-3/70 mb-3">
              Working days are calculated from marked attendance entries
              (Present + Absent), excluding holidays and Sunday Holidays.
            </p>
            <div className="flex flex-wrap gap-4 items-baseline">
              <div>
                <p className="text-xs uppercase text-neutral-3/60">
                  Attendance
                </p>
                <p className="text-2xl font-bold text-primary">
                  {monthSummary.percent != null
                    ? `${monthSummary.percent}%`
                    : "—"}
                </p>
                {monthSummary.percent < 75 && monthSummary.percent !== null && (
                  <p className="text-[10px] text-red-600 font-bold uppercase mt-1 animate-pulse">Low Attendance Alert</p>
                )}
              </div>
              <div className="text-sm text-neutral-3">
                <span className="text-green-700 font-medium">
                  Present: {monthSummary.present}
                </span>
                <span className="mx-2 text-neutral-3/40">|</span>
                <span className="text-red-700 font-medium">
                  Absent: {monthSummary.absent}
                </span>
                <span className="mx-2 text-neutral-3/40">|</span>
                <span>
                  Working days:{" "}
                  <span className="font-semibold">
                    {monthSummary.workingDays}
                  </span>
                </span>
                {monthSummary.unmarked > 0 && (
                  <>
                    <span className="mx-2 text-neutral-3/40">|</span>
                    <span className="text-neutral-3/80">
                      Not marked: {monthSummary.unmarked}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-neutral-3/80">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-green-100 border border-green-200" />
              Present
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-red-100 border border-red-200" />
              Absent
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-amber-100 border border-amber-200" />
              Holiday
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-white border border-neutral-1" />
              No record
            </span>
          </div>

          <div className="bg-neutral-2 rounded-lg shadow-md p-4 border border-neutral-1">
            <h3 className="text-lg font-semibold text-neutral-3 mb-3">
              {monthLabel} {year}
            </h3>
            <div className="grid grid-cols-7 gap-2 mb-2 text-xs font-semibold text-neutral-3/60">
              <div className="text-center">Sun</div>
              <div className="text-center">Mon</div>
              <div className="text-center">Tue</div>
              <div className="text-center">Wed</div>
              <div className="text-center">Thu</div>
              <div className="text-center">Fri</div>
              <div className="text-center">Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((day, index) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[4.5rem] rounded border border-transparent"
                    />
                  );
                }
                const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const holiday = calendarHolidayByDate[dateKey];
                const status = attendanceByDate[dateKey];

                let label = "";
                let cellClass =
                  "min-h-[4.5rem] rounded border p-2 text-xs bg-white border-neutral-1";
                if (holiday) {
                  label = "Holiday";
                  cellClass =
                    "min-h-[4.5rem] rounded border p-2 text-xs bg-amber-50 border-amber-200";
                } else if (status === "Present") {
                  label = "Present";
                  cellClass =
                    "min-h-[4.5rem] rounded border p-2 text-xs bg-green-50 border-green-200";
                } else if (status === "Absent") {
                  label = "Absent";
                  cellClass =
                    "min-h-[4.5rem] rounded border p-2 text-xs bg-red-50 border-red-200";
                }

                return (
                  <div key={dateKey} className={cellClass}>
                    <p className="font-semibold text-neutral-3">{day}</p>
                    {holiday && (
                      <p
                        className="mt-1 text-amber-800 truncate"
                        title={holiday.title}
                      >
                        {holiday.title}
                      </p>
                    )}
                    {!holiday && label && (
                      <p
                        className={`mt-1 ${
                          status === "Present"
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {label}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {!loading &&
            attendanceData.length === 0 &&
            !error && (
              <p className="text-neutral-3/70 text-sm">
                No attendance records for this month. Days without colour have
                no mark yet.
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
