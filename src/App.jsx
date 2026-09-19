import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingSummary from './pages/BookingSummary';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/movie/:id" element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/seat-selection" element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          } />
          
          <Route path="/booking-summary" element={
            <ProtectedRoute>
              <BookingSummary />
            </ProtectedRoute>
          } />
          
          <Route path="/booking-confirmation" element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          } />
          
          <Route path="/bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
