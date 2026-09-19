import React, { useState, useEffect } from 'react';
import { ShowService, MovieService, TheatreService, ScreenService } from '../../services/api';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({ showId: null, movieId: '', theatreId: '', screenId: '', date: '', startTime: '', endTime: '', price: 15 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const sData = await ShowService.getAll();
    const mData = await MovieService.getAll();
    const tData = await TheatreService.getAll();
    const cData = await ScreenService.getAll();
    
    setMovies(mData);
    setTheatres(tData);
    setScreens(cData);
    setShows(sData);
    setLoading(false);
  };

  const handleEdit = (show) => {
    const startString = new Date(show.startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const endString = show.endTime ? new Date(show.endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '';
    setFormData({ ...show, movieId: show.movieId.toString(), theatreId: show.theatreId.toString(), screenId: show.screenId.toString(), startTime: startString, endTime: endString });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this show? Note: In a real database this might soft-delete to preserve booking history.')) {
       try {
         await ShowService.delete(id);
         loadData();
       } catch (error) {
         alert("Cannot delete this show. It is likely referenced by existing booking history.");
       }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    if (formData.date < today && !formData.showId) {
       alert("Cannot schedule a new show in the past.");
       return;
    }

    const isoStart = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
    const isoEnd = formData.endTime ? new Date(`${formData.date}T${formData.endTime}:00`).toISOString() : null;
    
    const payload = { ...formData, movieId: parseInt(formData.movieId), theatreId: parseInt(formData.theatreId), screenId: parseInt(formData.screenId), price: parseFloat(formData.price), startTime: isoStart, endTime: isoEnd };
    
    if (formData.showId) {
       await ShowService.update(formData.showId, payload);
    } else {
       await ShowService.create(payload);
    }
    setShowForm(false);
    setFormData({ showId: null, movieId: '', theatreId: '', screenId: '', date: '', startTime: '', endTime: '', price: 15 });
    loadData();
  };

  if(loading) return <div className="mono loading">LOADING SHOWS...</div>;

  const mMap = {}; movies.forEach(m => mMap[m.id] = m.title);
  const tMap = {}; theatres.forEach(t => tMap[t.theatreId] = t.theatreName);
  const cMap = {}; screens.forEach(c => cMap[c.screenId] = c.screenName);

  const availableScreens = formData.theatreId ? screens.filter(s => s.theatreId === parseInt(formData.theatreId)) : [];
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '1rem'}}>
        <h2 className="serif" style={{margin: 0}}>SHOW SCHEDULE</h2>
        <button className="btn btn-primary mono" style={{padding: '0.5rem 1rem'}} onClick={() => { setFormData({ showId: null, movieId: '', theatreId: '', screenId: '', date: '', startTime: '', endTime: '', price: 15 }); setShowForm(!showForm); }}>
          {showForm ? 'CANCEL' : '+ SCHEDULE SHOW'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{padding: '2rem', border: '2px solid var(--ink)', marginTop: '2rem', background: 'var(--paper)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}} className="mono">
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Movie 
             <select required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={formData.movieId} onChange={e => setFormData({...formData, movieId: e.target.value})}>
                <option value="" disabled>Select Movie...</option>
                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
             </select>
          </label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Theatre 
             <select required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={formData.theatreId} onChange={e => { setFormData({...formData, theatreId: e.target.value, screenId: ''}); }}>
                <option value="" disabled>Select Theatre...</option>
                {theatres.map(t => <option key={t.theatreId} value={t.theatreId}>{t.theatreName}</option>)}
             </select>
          </label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Screen 
             <select required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={formData.screenId} onChange={e => setFormData({...formData, screenId: e.target.value})} disabled={!formData.theatreId}>
                <option value="" disabled>Select Screen...</option>
                {availableScreens.map(s => <option key={s.screenId} value={s.screenId}>{s.screenName} ({s.screenType})</option>)}
             </select>
          </label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Date <input required min={!formData.showId ? todayStr : undefined} style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Start Time <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>End Time <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Base Ticket Price ($) <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></label>
          <div style={{gridColumn: '1 / -1', marginTop: '1rem', textAlign: 'right'}}>
             <button type="submit" className="btn btn-primary" style={{padding: '1rem 2rem'}}>{formData.showId ? 'UPDATE' : 'SCHEDULE'} SHOW</button>
          </div>
        </form>
      )}
      
      <table className="admin-table mono" style={{fontSize: '0.85rem'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>MOVIE</th>
            <th>THEATRE & SCREEN</th>
            <th>DATE & TIME</th>
            <th>PRICE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {shows.map(s => (
            <tr key={s.showId}>
              <td>{s.showId}</td>
              <td style={{fontWeight: 700}}>{mMap[s.movieId]}</td>
              <td>{tMap[s.theatreId]} <br/><span style={{opacity:0.7}}>{cMap[s.screenId]}</span></td>
              <td>{s.date} <br/><span style={{opacity:0.7}}>
                {new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {s.endTime ? new Date(s.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
              </span></td>
              <td>${Number(s.price).toFixed(2)}</td>
              <td>
                <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem'}} onClick={() => handleEdit(s)}>EDIT</button>
                <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red', borderColor: 'red'}} onClick={() => handleDelete(s.showId)}>DEL</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminShows;
