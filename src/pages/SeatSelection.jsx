import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeatMap from '../components/SeatMap';
import { ShowService } from '../services/api';

const SeatSelection = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [layoutType, setLayoutType] = useState('UNKNOWN');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!state || !state.movie || !state.show) {
    return <><Navbar /><div className="container"><p className="mono" style={{marginTop:'2rem'}}>ERROR: NO SHOW SELECTED.</p></div></>;
  }

  const { movie, show } = state;

  useEffect(() => {
    ShowService.getSeatsForShow(show.showId).then(data => {
      setSeats(data.seats);
      setLayoutType(data.layoutType);
      setLoading(false);
    });
  }, [show.showId]);

  const handleSeatClick = (seat) => {
    const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.seatId !== seat.seatId));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + (s.price || show.price), 0);

  const handleContinue = () => {
    navigate('/booking-summary', { state: { movie, show, selectedSeats, totalPrice } });
  };

  if (loading) return <><Navbar /><div className="loading mono container">LOADING SEAT MAP...</div></>;

  return (
    <>
      <Navbar />
      <div className="page-container container">
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px dashed var(--ink)', paddingBottom: '1rem', marginBottom: '2rem'}}>
          <div>
            <h2 className="serif" style={{fontSize: '2.5rem', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.25rem'}}>{movie.title}</h2>
            <div className="mono" style={{fontWeight: 700}}>
              {show.theatre.theatreName.toUpperCase()} &middot; {new Date(show.startTime).toLocaleString([], {dateStyle:'short', timeStyle:'short'})}
            </div>
          </div>
          
          <div className="mono" style={{textAlign: 'right', borderLeft: '2px dashed var(--ink)', paddingLeft: '1rem'}}>
             <div style={{fontWeight: 700, fontSize: '0.75rem', opacity: 0.8}}>THEATRE</div>
             <div style={{marginBottom: '0.5rem'}}>{show.theatre.city}</div>
             <div style={{fontWeight: 700, fontSize: '0.75rem', opacity: 0.8}}>ARRANGEMENT</div>
             <div style={{color: 'var(--accent)', fontWeight: 700}}>{layoutType.replace('_', ' ')}</div>
          </div>
        </div>
        
        <SeatMap seats={seats} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} arrangement={layoutType} />
        
        <div style={{
           border: '2px solid var(--ink)',
           padding: '1.5rem', 
           display: 'flex', 
           justifyContent: 'space-between', 
           alignItems: 'center', 
           marginTop: '2rem', 
           flexWrap: 'wrap', 
           gap: '1rem',
           background: 'var(--disabled)'
        }}>
          <div>
            <p className="mono" style={{fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.25rem'}}>
              SEATS SELECTED: {selectedSeats.length}
            </p>
            <p className="mono" style={{fontWeight: 700, opacity: 0.8}}>
              {selectedSeats.length > 0 ? selectedSeats.map(s => s.seatId).join(', ') : '-'}
            </p>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
            <h3 className="serif" style={{fontSize: '1.75rem', lineHeight: 1}}>TOTAL: ${totalPrice}</h3>
            <button 
              className="btn btn-primary" 
              disabled={selectedSeats.length === 0} 
              onClick={handleContinue}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatSelection;
