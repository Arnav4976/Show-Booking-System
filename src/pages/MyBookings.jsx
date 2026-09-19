import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { BookingService } from '../services/api';
import './Ticket.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        BookingService.getUserBookings().then(data => {
            setBookings([...data].sort((a,b) => new Date(b.bookingDate) - new Date(a.bookingDate)));
            setLoading(false);
        });
    }, []);

    return (
        <>
        <Navbar />
        <div className="page-container container" style={{maxWidth: '900px', margin: '0 auto'}}>
            <h2 className="serif" style={{marginBottom: '4rem', fontSize: '4rem', borderBottom: '4px solid var(--ink)', paddingBottom: '1rem'}}>TICKET ARCHIVE</h2>
            
            {loading ? <div className="loading mono">SEARCHING RECORDS...</div> : 
             bookings.length === 0 ? (
                 <div style={{padding: '4rem', textAlign: 'center', border: '2px solid var(--ink)', background: 'var(--disabled)', boxShadow: '8px 8px 0 var(--ink)'}}>
                     <p className="mono" style={{fontSize: '1.25rem', marginBottom: '2rem', fontWeight: 700}}>NO TICKETS FOUND IN LEDGER.</p>
                     <a href="/" className="btn btn-primary">BROWSE PROGRAMME</a>
                 </div>
             ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '4rem'}}>
                    {bookings.map(booking => (
                        <div key={booking.bookingId} className="ticket-container" style={{maxWidth: '100%', flexDirection: 'row', display: 'flex'}}>
                            <div className="ticket-main" style={{flex: 1, display: 'flex', gap: '3rem', alignItems: 'center', padding: '2rem'}}>
                              <img src={booking.movie.posterUrl || booking.movie.poster} alt={booking.movie.title} style={{width: '120px', border: '2px solid var(--ink)', filter: 'sepia(0.2) contrast(1.1)'}} />
                              <div>
                                  <h4 className="serif" style={{fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1rem', lineHeight: 1}}>{booking.movie.title}</h4>
                                  <div style={{display: 'flex', gap: '3rem', marginTop: '1.5rem'}} className="mono">
                                    <div>
                                      <span style={{display: 'block', opacity: 0.7, fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem'}}>DATE & TIME</span>
                                      <span style={{fontWeight: 700}}>{new Date(booking.show.startTime).toLocaleString([], {dateStyle:'short', timeStyle:'short'})}</span>
                                    </div>
                                    <div>
                                      <span style={{display: 'block', opacity: 0.7, fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem'}}>AUDITORIUM</span>
                                      <span style={{fontWeight: 700}}>{booking.show.theatre.theatreName.toUpperCase()}</span>
                                    </div>
                                    <div>
                                      <span style={{display: 'block', opacity: 0.7, fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem'}}>SEATS</span>
                                      <span style={{fontWeight: 700}}>{booking.selectedSeats.join(', ')}</span>
                                    </div>
                                  </div>
                              </div>
                            </div>
                            
                            <div style={{borderLeft: '2px dashed var(--ink)', width: '220px', padding: '2rem', background: 'var(--disabled)', display: 'flex', flexDirection: 'column', justifyContent: 'center'}} className="mono">
                                <p style={{fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, marginBottom: '0.25rem'}}>REFERENCE NO.</p>
                                <p style={{fontWeight: 700, marginBottom: '2rem', fontSize: '1.1rem'}}>{booking.bookingId}</p>
                                <p style={{fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, marginBottom: '0.25rem'}}>TOTAL FARE</p>
                                <h3 className="serif" style={{fontSize: '3rem', color: 'var(--accent)', lineHeight: 1}}>${Number(booking.totalAmount).toFixed(2)}</h3>
                                {booking.bookingStatus === 'CANCELLED' && <p style={{color: 'red', fontWeight: 700, marginTop: '1rem'}}>CANCELLED</p>}
                            </div>
                        </div>
                    ))}
                    
                    <div style={{marginTop: '2rem', padding: '2rem', border: '2px solid var(--ink)', background: 'var(--paper)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className="mono">
                        <div>
                            <p style={{fontSize: '0.85rem', fontWeight: 700, opacity: 0.7, marginBottom: '0.25rem'}}>ACCOUNT SUMMARY</p>
                            <h3 style={{fontSize: '1.5rem', margin: 0}}>TOTAL SPENT</h3>
                        </div>
                        <h2 className="serif" style={{fontSize: '3.5rem', color: 'var(--ink)', margin: 0}}>
                            ${Number(bookings.filter(b => b.bookingStatus !== 'CANCELLED').reduce((sum, b) => sum + b.totalAmount, 0)).toFixed(2)}
                        </h2>
                    </div>
                </div>
             )
            }
        </div>
        </>
    );
};

export default MyBookings;
