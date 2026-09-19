import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { BookingService } from '../services/api';
import './Ticket.css';

const BookingSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  if (!state || !state.movie) return (
    <><Navbar /><div className="container" style={{paddingTop:'4rem'}}><p className="mono">ERROR: INVALID NAVIGATION.</p></div></>
  );

  const { movie, show, selectedSeats, totalPrice } = state;

  const handleConfirm = async () => {
    setError('');
    setIsBooking(true);
    try {
      const bookingResponse = await BookingService.create({
        userId: 1, // hardcoded guest user
        showId: show.showId,
        selectedSeats: selectedSeats.map(s => s.seatId),
        totalAmount: totalPrice
      });
      navigate('/booking-confirmation', { state: { booking: bookingResponse, movie, show, selectedSeats } });
    } catch (err) {
      setError(err.message || "An unexpected error occurred while booking.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container container" style={{display: 'flex', justifyContent: 'center'}}>
        <div className="ticket-container">
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
                     <span className="label">ADMIT</span>
                     <span className="value">{selectedSeats.length}</span>
                  </div>
               </div>
             </div>
          </div>
          
          <div className="ticket-divider"></div>
          
          <div className="ticket-stub">
            <div className="ticket-total mono">
               <span className="label">TOTAL FARE</span>
               <h1 className="serif">${totalPrice}</h1>
            </div>
            {error && <div className="mono" style={{color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
            <button 
              className="btn btn-primary" 
              style={{width: '100%', padding: '1.25rem', fontSize: '1.2rem'}}
              onClick={handleConfirm}
              disabled={isBooking}
            >
              {isBooking ? 'STAMPING...' : 'CONFIRM & PRINT'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSummary;
