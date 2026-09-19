import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Ticket.css';

const BookingConfirmation = () => {
    const { state } = useLocation();
    
    if (!state || !state.booking) return (
      <><Navbar /><div className="container" style={{paddingTop:'4rem'}}><p className="mono">ERROR: INVALID NAVIGATION.</p></div></>
    );

    const { booking, movie, show, selectedSeats } = state;

    return (
      <>
        <Navbar />
        <div className="page-container container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            
            <h1 className="serif" style={{color: 'var(--accent)', fontSize: '5rem', textTransform: 'uppercase', marginBottom: '2rem'}}>ADMITTED.</h1>
            
            <div className="ticket-container" style={{marginBottom: '3rem', transform: 'rotate(-2deg)'}}>
              <div className="ticket-main">
                 <h2 className="serif ticket-header">CINEPRIME TICKET</h2>
                 <div className="ticket-body">
                   <h3 className="serif movie-title">{movie.title}</h3>
                   <div className="ticket-grid mono">
                      <div className="ticket-detail">
                         <span className="label">DATE & TIME</span>
                         <span className="value">{new Date(show.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <div className="ticket-detail">
                         <span className="label">AUDITORIUM</span>
                         <span className="value">{show.theatre.theatreName.toUpperCase()}</span>
                      </div>
                      <div className="ticket-detail">
                         <span className="label">SEAT(S)</span>
                         <span className="value">{selectedSeats.map(s => s.seatId).join(', ')}</span>
                      </div>
                      <div className="ticket-detail">
                         <span className="label">REFERENCE</span>
                         <span className="value" style={{color: 'var(--accent)'}}>{booking.bookingId}</span>
                      </div>
                   </div>
                 </div>
              </div>
              <div className="ticket-divider"></div>
              <div className="ticket-stub" style={{textAlign: 'center', paddingTop: '2.5rem', paddingBottom: '2.5rem'}}>
                 <div className="mono" style={{fontWeight: 700, fontSize: '1.2rem', opacity: 0.8}}>FARE: ${booking.totalAmount}</div>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '2rem', justifyContent: 'center'}}>
                <Link to="/" className="btn">RETURN TO LOBBY</Link>
                <Link to="/bookings" className="btn btn-primary">MY TICKETS</Link>
            </div>
        </div>
      </>
    );
};

export default BookingConfirmation;
