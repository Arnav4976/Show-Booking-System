import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminMovies from './AdminMovies';
import AdminTheatres from './AdminTheatres';
import AdminScreens from './AdminScreens';
import AdminShows from './AdminShows';
import AdminBookings from './AdminBookings';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const location = useLocation();
  
  const getLinkClass = (path) => {
    return location.pathname === path ? 'admin-nav-link active' : 'admin-nav-link';
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{display: 'flex', marginTop: '2rem', gap: '3rem', minHeight: '80vh'}}>
        {/* Sidebar */}
        <div style={{width: '250px', borderRight: '2px solid var(--ink)', paddingRight: '2rem', flexShrink: 0}}>
          <h2 className="serif" style={{marginBottom: '2rem', borderBottom: '2px dashed var(--ink)', paddingBottom: '1rem'}}>CONTROL PANEL</h2>
          <nav style={{display: 'flex', flexDirection: 'column', gap: '1rem'}} className="mono">
             <Link to="/admin" className={getLinkClass('/admin')}>OVERVIEW</Link>
             <Link to="/admin/movies" className={getLinkClass('/admin/movies')}>MOVIES</Link>
             <Link to="/admin/theatres" className={getLinkClass('/admin/theatres')}>THEATRES</Link>
             <Link to="/admin/screens" className={getLinkClass('/admin/screens')}>SCREENS</Link>
             <Link to="/admin/shows" className={getLinkClass('/admin/shows')}>SHOWS</Link>
             <Link to="/admin/bookings" className={getLinkClass('/admin/bookings')}>BOOKING LEDGER</Link>
          </nav>
        </div>

        {/* Main Content Area */}
        <div style={{flex: 1, paddingBottom: '4rem'}}>
          <Routes>
            <Route path="/" element={<div className="mono"><h3>SYSTEM STATUS: ONLINE</h3><p style={{opacity:0.7, marginTop: '1rem'}}>Select a module from the sidebar to manage records.</p></div>} />
            <Route path="/movies" element={<AdminMovies />} />
            <Route path="/theatres" element={<AdminTheatres />} />
            <Route path="/screens" element={<AdminScreens />} />
            <Route path="/shows" element={<AdminShows />} />
            <Route path="/bookings" element={<AdminBookings />} />
          </Routes>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .admin-nav-link {
           text-decoration: none;
           color: var(--ink);
           padding: 0.5rem 1rem;
           border: 2px solid transparent;
           font-weight: 700;
           transition: all 0.1s ease;
        }
        .admin-nav-link:hover {
           border-color: var(--ink);
        }
        .admin-nav-link.active {
           background: var(--ink);
           color: var(--paper);
           border-color: var(--ink);
        }
        .admin-table {
           width: 100%;
           border-collapse: collapse;
           margin-top: 2rem;
        }
        .admin-table th, .admin-table td {
           border: 2px solid var(--ink);
           padding: 0.75rem 1rem;
           text-align: left;
        }
        .admin-table th {
           background: var(--disabled);
           font-weight: 700;
        }
      `}} />
    </>
  );
};

export default AdminDashboard;
