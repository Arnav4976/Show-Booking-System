import React, { useState, useEffect } from 'react';
import { BookingService } from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await BookingService.getAll();
    setBookings([...data].sort((a,b) => new Date(b.bookingDate) - new Date(a.bookingDate)));
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if(window.confirm('Cancel this booking? This will release the seats.')) {
       setCancellingId(id);
       await BookingService.delete(id);
       await loadBookings();
       setCancellingId(null);
    }
  };

  if(loading) return <div className="mono loading">LOADING BOOKINGS...</div>;

  const totalRevenue = bookings.filter(b => b.bookingStatus === 'CONFIRMED').reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '1rem'}}>
        <h2 className="serif" style={{margin: 0}}>BOOKING LEDGER</h2>
        <div className="mono" style={{textAlign: 'right'}}>
          <div style={{fontSize: '0.75rem', fontWeight: 700, opacity: 0.8}}>TOTAL CONFIRMED REVENUE</div>
          <div className="serif" style={{color: 'var(--accent)', fontSize: '2rem', lineHeight: 1}}>${totalRevenue.toFixed(2)}</div>
        </div>
      </div>
      
      <table className="admin-table mono" style={{fontSize: '0.85rem'}}>
        <thead>
          <tr>
            <th>REF</th>
            <th>USER ID</th>
            <th>SHOW ID</th>
            <th>DATE BOOKED</th>
            <th>SEATS</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.bookingId} style={{ opacity: b.bookingStatus === 'CANCELLED' ? 0.5 : 1 }}>
              <td style={{fontWeight: 700}}>{b.bookingId}</td>
              <td>{b.userId}</td>
              <td>{b.showId}</td>
              <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
              <td style={{maxWidth: '150px'}}>{b.selectedSeats.join(', ')}</td>
              <td>${b.totalAmount}</td>
              <td style={{color: b.bookingStatus === 'CANCELLED' ? 'red' : 'var(--ink)'}}>{b.bookingStatus}</td>
              <td>
                <button 
                   className="btn" 
                   style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red', borderColor: 'red'}} 
                   onClick={() => handleCancel(b.bookingId)}
                   disabled={b.bookingStatus === 'CANCELLED' || cancellingId === b.bookingId}
                >
                  {cancellingId === b.bookingId ? 'WAIT...' : 'CANCEL'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
