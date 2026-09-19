import React from 'react';
import './SeatMap.css';

const SeatMap = ({ seats, selectedSeats, onSeatClick, arrangement }) => {
  if (!seats || seats.length === 0) return <div className="mono">NO SEATS AVAILABLE</div>;

  const renderSeat = (seat) => {
    if (!seat) return null;
    const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
    return (
      <button
        key={seat.seatId}
        className={`seat mono ${seat.status} ${isSelected ? 'selected' : ''}`}
        disabled={seat.status === 'occupied'}
        onClick={() => onSeatClick(seat)}
        aria-label={`Seat ${seat.seatId}`}
        title={`Seat ${seat.seatId}`}
      >
        {isSelected ? '✓' : seat.seatId}
      </button>
    );
  };

  const renderLayout = () => {
    switch(arrangement) {
      case 'END_STAGE': {
        const rows = seats.reduce((acc, seat) => {
          const r = seat.row;
          if (!acc[r]) acc[r] = [];
          acc[r].push(seat);
          return acc;
        }, {});
        return (
          <div className="layout-end-stage">
            <div className="screen-wrapper"><div className="screen-line"></div><p className="mono">STAGE</p></div>
            <div className="theater-block">
              {Object.keys(rows).sort().map(r => (
                <div key={r} className="seat-row">
                   <span className="row-label mono">{r}</span>
                   {rows[r].map(renderSeat)}
                   <span className="row-label mono">{r}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'SEMI_CIRCLE': {
        const rows = seats.reduce((acc, seat) => {
          const r = seat.row;
          if (!acc[r]) acc[r] = [];
          acc[r].push(seat);
          return acc;
        }, {});
        return (
          <div className="layout-semi-circle">
            <div className="screen-wrapper curve"><p className="mono" style={{marginTop:'10px'}}>STAGE</p></div>
            <div className="theater-block">
              {Object.keys(rows).sort().map((r, idx) => (
                <div key={r} className="seat-row" style={{ marginTop: `${idx * 4}px`}}>
                   {rows[r].map(renderSeat)}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'FLOOR_SEATING': {
        const clusters = seats.reduce((acc, seat) => {
          const c = seat.row; 
          if (!acc[c]) acc[c] = [];
          acc[c].push(seat);
          return acc;
        }, {});
        return (
          <div className="layout-floor-seating">
            <div className="screen-wrapper"><div className="screen-line"></div><p className="mono">PERFORMANCE AREA</p></div>
            <div className="clusters-grid">
              {Object.keys(clusters).sort().map(c => (
                 <div key={c} className="floor-cluster">
                    {clusters[c].map((seat) => {
                       const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
                       return (
                         <button key={seat.seatId} className={`floor-seat mono ${seat.status} ${isSelected ? 'selected' : ''}`} disabled={seat.status === 'occupied'} onClick={() => onSeatClick(seat)}>
                           {isSelected ? '✓' : '○'}
                         </button>
                       );
                    })}
                 </div>
              ))}
            </div>
          </div>
        );
      }
      case 'THRUST': {
        const getGroup = (side) => seats.filter(s => s.seatId.startsWith(side));
        return (
          <div className="layout-thrust">
            <div className="thrust-grid">
               <div className="thrust-side thrust-left">
                  {getGroup('L').map(renderSeat)}
               </div>
               <div className="thrust-center">
                  <div className="screen-wrapper thrust-stage"><p className="mono" style={{paddingTop:'4rem'}}>STAGE</p></div>
                  <div className="thrust-front">
                     {getGroup('F').map(renderSeat)}
                  </div>
               </div>
               <div className="thrust-side thrust-right">
                  {getGroup('R').map(renderSeat)}
               </div>
            </div>
          </div>
        );
      }
      case 'IN_THE_ROUND': {
        const getGroup = (side) => seats.filter(s => s.seatId.startsWith(side));
        return (
          <div className="layout-round">
            <div className="round-top">{getGroup('N').map(renderSeat)}</div>
            <div className="round-middle">
               <div className="round-left">{getGroup('W').map(renderSeat)}</div>
               <div className="screen-wrapper round-stage"><p className="mono">STAGE</p></div>
               <div className="round-right">{getGroup('E').map(renderSeat)}</div>
            </div>
            <div className="round-bottom">{getGroup('S').map(renderSeat)}</div>
          </div>
        );
      }
      case 'CABARET': {
        const tables = seats.reduce((acc, seat) => {
          const t = seat.row;
          if (!acc[t]) acc[t] = [];
          acc[t].push(seat);
          return acc;
        }, {});
        return (
          <div className="layout-cabaret">
            <div className="screen-wrapper"><div className="screen-line"></div><p className="mono">STAGE</p></div>
            <div className="tables-grid">
              {Object.keys(tables).sort().map(t => (
                 <div key={t} className="cabaret-table-wrapper">
                    <div className="cabaret-table mono">[TABLE]</div>
                    <div className="cabaret-seats">
                      {tables[t].map(renderSeat)}
                    </div>
                 </div>
              ))}
            </div>
          </div>
        );
      }
      default:
        return <div className="mono">UNKNOWN ARRANGEMENT</div>;
    }
  };

  return (
    <div className="seat-map-container">
      {renderLayout()}

      <div className="seat-legend mono">
        <div className="legend-item">
          <div className="seat available legend-seat"></div>
          <span>AVAILABLE</span>
        </div>
        <div className="legend-item">
          <div className="seat selected legend-seat">✓</div>
          <span>SELECTED</span>
        </div>
        <div className="legend-item">
          <div className="seat occupied legend-seat"></div>
          <span>OCCUPIED</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
