import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AssistantPage from './pages/AssistantPage';
import AcademicDetailsPage from './pages/AcademicDetailsPage';
import DashboardPage from './pages/DashboardPage';
import FinancialDetailsPage from './pages/FinancialDetailsPage';
import LandingPage from './pages/LandingPage';
import NotificationsPage from './pages/NotificationsPage';
import PersonalDetailsPage from './pages/PersonalDetailsPage';
import ProgramPage from './pages/ProgramPage';
import ReviewSubmitPage from './pages/ReviewSubmitPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<SignupPage />} path="/signup" />
        <Route element={<PersonalDetailsPage />} path="/personal-details" />
        <Route element={<AcademicDetailsPage />} path="/academic-details" />
        <Route element={<FinancialDetailsPage />} path="/financial-details" />
        <Route element={<ReviewSubmitPage />} path="/review-submit" />
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<NotificationsPage />} path="/notifications" />
        <Route element={<AssistantPage />} path="/assistant" />
        <Route element={<ProgramPage />} path="/programs/:slug" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </HashRouter>
  );
}
