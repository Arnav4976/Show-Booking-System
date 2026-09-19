import React, { useState, useEffect } from 'react';
import { MovieService } from '../../services/api';
import StarRatingInput from '../../components/StarRatingInput';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', genre: '', language: '', duration: 120, rating: 0, releaseDate: '', posterUrl: '', status: 'Now Showing' });
  
  const [durationHrs, setDurationHrs] = useState(2);
  const [durationMins, setDurationMins] = useState(0);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const data = await MovieService.getAll();
    setMovies(data);
    setLoading(false);
  };

  const handleEdit = (movie) => {
    setFormData(movie);
    setDurationHrs(Math.floor((movie.duration || 120) / 60));
    setDurationMins((movie.duration || 120) % 60);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this movie?')) {
       try {
         await MovieService.delete(id);
         loadMovies();
       } catch (error) {
         alert("Cannot delete this movie. It is likely referenced by existing shows or booking history.");
       }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    if (formData.releaseDate < today && !formData.id) {
       alert("Cannot schedule a new movie with a past release date.");
       return;
    }

    const totalDuration = (parseInt(durationHrs) || 0) * 60 + (parseInt(durationMins) || 0);
    const payload = { ...formData, duration: totalDuration, rating: parseFloat(formData.rating) };

    if (payload.id) {
       await MovieService.update(payload.id, payload);
    } else {
       await MovieService.create(payload);
    }
    setShowForm(false);
    resetForm();
    loadMovies();
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', description: '', genre: '', language: '', duration: 120, rating: 0, releaseDate: '', posterUrl: '', status: 'Now Showing' });
    setDurationHrs(2);
    setDurationMins(0);
  };

  if(loading) return <div className="mono loading">LOADING MOVIES...</div>;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '1rem'}}>
        <h2 className="serif" style={{margin: 0}}>MOVIES</h2>
        <button className="btn btn-primary mono" style={{padding: '0.5rem 1rem'}} onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'CANCEL' : '+ ADD MOVIE'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{padding: '2rem', border: '2px solid var(--ink)', marginTop: '2rem', background: 'var(--paper)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}} className="mono">
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Title <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Genre <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="text" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Language <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="text" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} /></label>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <label>Duration</label>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
               <input required type="number" min="0" max="24" style={{width: '70px', padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={durationHrs} onChange={e => setDurationHrs(e.target.value)} /> <span style={{fontSize: '0.85rem'}}>hrs</span>
               <input required type="number" min="0" max="59" style={{width: '70px', padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={durationMins} onChange={e => setDurationMins(e.target.value)} /> <span style={{fontSize: '0.85rem'}}>mins</span>
            </div>
          </div>

          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            Rating
            <StarRatingInput value={formData.rating} onChange={(val) => setFormData({...formData, rating: val})} />
          </label>
          
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Release Date <input required min={!formData.id ? todayStr : undefined} style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="date" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>Poster URL <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="url" value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>Description <textarea required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent', minHeight: '100px'}} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Status 
             <select style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Now Showing">Now Showing</option>
                <option value="Coming Soon">Coming Soon</option>
             </select>
          </label>
          <div style={{gridColumn: '1 / -1', marginTop: '1rem', textAlign: 'right'}}>
             <button type="submit" className="btn btn-primary" style={{padding: '1rem 2rem'}}>{formData.id ? 'UPDATE' : 'CREATE'} MOVIE</button>
          </div>
        </form>
      )}
      
      <table className="admin-table mono" style={{fontSize: '0.85rem'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>TITLE</th>
            <th>DURATION</th>
            <th>RATING</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td style={{fontWeight: 700}}>{m.title}</td>
              <td>{Math.floor((m.duration||0)/60)} hr {(m.duration||0)%60} min</td>
              <td>{parseFloat(m.rating||0).toFixed(1)} ★</td>
              <td>{m.status}</td>
              <td>
                <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem'}} onClick={() => handleEdit(m)}>EDIT</button>
                <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red', borderColor: 'red'}} onClick={() => handleDelete(m.id)}>DEL</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMovies;
