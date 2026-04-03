import { toDateKeyYMD } from "./date";

/**
 * Working days are derived from marked attendance entries:
 * total working days = Present + Absent (excluding holiday dates).
 */
export function getMonthAttendanceSummary(
  year,
  month,
  attendanceByDate,
  holidayByDate,
) {
  let present = 0;
  let absent = 0;
  Object.entries(attendanceByDate || {}).forEach(([dateKey, status]) => {
    if (!dateKey.startsWith(`${year}-${String(month).padStart(2, "0")}-`)) {
      return;
    }
    if (holidayByDate[dateKey]) return;
    if (status === "Present") present += 1;
    else if (status === "Absent") absent += 1;
  });

  const workingDays = present + absent;
  const unmarked = 0;
  const percent =
    workingDays > 0
      ? Math.round((present / workingDays) * 1000) / 10
      : null;

  return { workingDays, present, absent, unmarked, percent };
}

export function getMonthAttendanceSummaryFromRecords(
  year,
  month,
  records,
  holidays,
) {
  const attendanceByDate = (records || []).reduce((acc, rec) => {
    const key = toDateKeyYMD(rec.date);
    if (key) acc[key] = rec.status;
    return acc;
  }, {});
  const holidayByDate = (holidays || []).reduce((acc, h) => {
    const key = toDateKeyYMD(h.date);
    if (key) acc[key] = h;
    return acc;
  }, {});
  return getMonthAttendanceSummary(
    year,
    month,
    attendanceByDate,
    holidayByDate,
  );
}
