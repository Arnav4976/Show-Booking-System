import React, { useState, useEffect } from 'react';
import { TheatreService } from '../../services/api';

const AdminTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ theatreId: null, theatreName: '', city: '', address: '' });

  useEffect(() => {
    loadTheatres();
  }, []);

  const loadTheatres = async () => {
    try {
      const data = await TheatreService.getAll();
      setTheatres(data);
    } catch (error) {
      console.error("Failed to load theatres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (theatre) => {
    setFormData(theatre);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this theatre?')) {
       try {
         await TheatreService.delete(id);
         loadTheatres();
       } catch (error) {
         alert("Cannot delete this theatre. It is likely referenced by existing screens or shows.");
       }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.theatreId) {
       await TheatreService.update(formData.theatreId, formData);
    } else {
       await TheatreService.create(formData);
    }
    setShowForm(false);
    setFormData({ theatreId: null, theatreName: '', city: '', address: '' });
    loadTheatres();
  };

  if(loading) return <div className="mono loading">LOADING THEATRES...</div>;

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '1rem'}}>
        <h2 className="serif" style={{margin: 0}}>THEATRES</h2>
        <button className="btn btn-primary mono" style={{padding: '0.5rem 1rem'}} onClick={() => { setFormData({ theatreId: null, theatreName: '', city: '', address: '' }); setShowForm(!showForm); }}>
          {showForm ? 'CANCEL' : '+ ADD THEATRE'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{padding: '2rem', border: '2px solid var(--ink)', marginTop: '2rem', background: 'var(--paper)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}} className="mono">
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>Theatre Name <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="text" value={formData.theatreName} onChange={e => setFormData({...formData, theatreName: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Address <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>City <input required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></label>
          <div style={{gridColumn: '1 / -1', marginTop: '1rem', textAlign: 'right'}}>
             <button type="submit" className="btn btn-primary" style={{padding: '1rem 2rem'}}>{formData.theatreId ? 'UPDATE' : 'CREATE'} THEATRE</button>
          </div>
        </form>
      )}
      
      <table className="admin-table mono" style={{fontSize: '0.85rem'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>ADDRESS</th>
            <th>CITY</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {theatres.map(t => (
            <tr key={t.theatreId}>
              <td>{t.theatreId}</td>
              <td style={{fontWeight: 700}}>{t.theatreName}</td>
              <td>{t.address}</td>
              <td>{t.city}</td>
              <td>
                <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem'}} onClick={() => handleEdit(t)}>EDIT</button>
                <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red', borderColor: 'red'}} onClick={() => handleDelete(t.theatreId)}>DEL</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTheatres;
