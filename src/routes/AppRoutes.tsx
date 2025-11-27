// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/pages/dashboard/dashboard-layout';
import ProfilePage from '@/pages/ProfilePage';
import MyTestPage from '@/pages/tests/MyTestsPage';
import CreateTestPage from '@/pages/tests-create/TestCreatePage';
import QuestionsPage from '@/pages/questions/QuestionsPage';
import StartTestPage from '@/pages/start-test/StartTestPage';
import SolveTestPage from '@/pages/solve-test/SolveTestPage';
import SubmissionResultsPage from '@/pages/submission-result/SubmissionResultsPage';


export default function AppRoutes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to="/dashboard" replace />
          }
        />
        <Route path="/login" element={<LoginPage />} />

        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }
            >
            <Route index element={<StartTestPage />} />
            <Route path="test" element={<MyTestPage />} />
            <Route path="test-create" element={<CreateTestPage />} />
            <Route path="questions" element={<QuestionsPage />} />
        </Route>
        <Route path="/start-test/:testId" element={<SolveTestPage />} />
        <Route path="/submissions/:submissionId" element={<SubmissionResultsPage />} />

      </Routes>
    </Suspense>
  );
}
