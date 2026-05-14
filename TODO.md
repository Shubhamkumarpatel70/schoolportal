# Project Stabilization & Refactoring - TODO

## 1. Teacher Dashboard stabilization
- [x] Fix syntax errors and redundant state logic
- [x] Verify Attendance and Exam Result modules
- [x] Production build readiness check

## 2. Admin Dashboard Refactoring
- [x] Extract modular components from monolithic AdminDashboard.js
  - [x] FeeManagement.jsx
  - [x] StudentManagement.jsx
  - [x] AttendanceManagement.jsx (with Calendar/Holiday logic)
  - [x] UserManagement.jsx
  - [x] FineManagement.jsx
  - [x] AcademicManagement.jsx (Classes, Teachers, Enrollments)
  - [x] CommunicationManagement.jsx (Notifications, Notices, Announcements)
  - [x] ContentManagement.jsx (Carousel, Gallery, Events)
  - [x] SystemManagement.jsx (Stats, Sessions, Contacts)
- [x] Implement robust student filtering (Roll No / Enrollment integration)
- [x] Resolve ID comparison bugs (.toString() fixes)
- [x] Cleanup AdminDashboard.js to ~200 lines
- [x] Implement Financial Analytics (Visual charts & Revenue summaries)
- [x] Implement Exam Management (Datesheets & Scheduling)

## 3. Production Readiness
- [x] Dynamic API_BASE_URL configuration
- [ ] Implement robust error boundaries
- [ ] Optimize image loading/storage for Gallery
- [ ] Final regression testing across all roles

## 4. Pending Bug Fixes
- [ ] Review any remaining strict equality checks in backend filters
- [ ] Verify multi-session logout behavior

## 5. New Features
- [x] Implement **Circular Management** (PDF Upload & Dynamic Viewing)
  - [x] Admin PDF upload functionality
  - [x] Shared viewing across Admin, Teacher, Student, and Accountant
- [x] **Accountant Dashboard** Overhaul
  - [x] Modularized logic and state management
  - [x] Integrated Financial Analytics charts
  - [x] Modern UI/UX sidebar and stats cards
