import React, { useState, useEffect } from 'react';
import { ScreenService, TheatreService } from '../../services/api';

const AdminScreens = () => {
  const [screens, setScreens] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterTheatreId, setFilterTheatreId] = useState('');
  const [formData, setFormData] = useState({ screenId: null, theatreId: '', screenName: '', screenType: 'END_STAGE' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const screensData = await ScreenService.getAll();
    const theatresData = await TheatreService.getAll();
    setScreens(screensData);
    setTheatres(theatresData);
    setLoading(false);
  };

  const handleEdit = (screen) => {
    setFormData({ ...screen, theatreId: screen.theatreId.toString() });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this screen?')) {
       try {
         await ScreenService.delete(id);
         loadData();
       } catch (error) {
         alert("Cannot delete this screen. It is likely referenced by existing seats or scheduled shows.");
       }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, theatreId: parseInt(formData.theatreId) };
    if (formData.screenId) {
       await ScreenService.update(formData.screenId, payload);
    } else {
       await ScreenService.create(payload);
    }
    setShowForm(false);
    setFormData({ screenId: null, theatreId: filterTheatreId || (theatres[0]?.theatreId.toString() || ''), screenName: '', screenType: 'END_STAGE' });
    loadData();
  };

  if(loading) return <div className="mono loading">LOADING SCREENS...</div>;

  const tMap = {};
  theatres.forEach(t => tMap[t.theatreId] = t.theatreName);

  const displayedScreens = filterTheatreId ? screens.filter(s => s.theatreId === parseInt(filterTheatreId)) : screens;

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '1rem'}}>
        <h2 className="serif" style={{margin: 0}}>SCREENS</h2>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <select className="mono" style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={filterTheatreId} onChange={e => setFilterTheatreId(e.target.value)}>
             <option value="">ALL THEATRES</option>
             {theatres.map(t => <option key={t.theatreId} value={t.theatreId}>{t.theatreName}</option>)}
          </select>
          <button className="btn btn-primary mono" style={{padding: '0.5rem 1rem'}} onClick={() => { setFormData({ screenId: null, theatreId: filterTheatreId || (theatres[0]?.theatreId.toString() || ''), screenName: '', screenType: 'END_STAGE' }); setShowForm(!showForm); }}>
            {showForm ? 'CANCEL' : '+ ADD SCREEN'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{padding: '2rem', border: '2px solid var(--ink)', marginTop: '2rem', background: 'var(--paper)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}} className="mono">
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Parent Theatre 
             <select required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={formData.theatreId} onChange={e => setFormData({...formData, theatreId: e.target.value})}>
                <option value="" disabled>Select Theatre...</option>
                {theatres.map(t => <option key={t.theatreId} value={t.theatreId}>{t.theatreName}</option>)}
             </select>
          </label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>Screen Name <input required placeholder="e.g. Screen 1" style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} type="text" value={formData.screenName} onChange={e => setFormData({...formData, screenName: e.target.value})} /></label>
          <label style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1'}}>Arrangement Type 
             <select required style={{padding: '0.5rem', border: '2px solid var(--ink)', background: 'transparent'}} value={formData.screenType} onChange={e => setFormData({...formData, screenType: e.target.value})}>
                <option value="END_STAGE">END_STAGE</option>
                <option value="THRUST">THRUST</option>
                <option value="CABARET">CABARET</option>
                <option value="IN_THE_ROUND">IN_THE_ROUND</option>
                <option value="SEMI_CIRCLE">SEMI_CIRCLE</option>
                <option value="FLOOR_SEATING">FLOOR_SEATING</option>
             </select>
          </label>
          <div style={{gridColumn: '1 / -1', marginTop: '1rem', textAlign: 'right'}}>
             <button type="submit" className="btn btn-primary" style={{padding: '1rem 2rem'}}>{formData.screenId ? 'UPDATE' : 'CREATE'} SCREEN</button>
          </div>
        </form>
      )}
      
      <table className="admin-table mono" style={{fontSize: '0.85rem'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>THEATRE</th>
            <th>SCREEN NAME</th>
            <th>ARRANGEMENT TYPE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {displayedScreens.map(s => (
            <tr key={s.screenId}>
              <td>{s.screenId}</td>
              <td style={{opacity: 0.8}}>{tMap[s.theatreId] || s.theatreId}</td>
              <td style={{fontWeight: 700}}>{s.screenName}</td>
              <td>{s.screenType}</td>
              <td>
                <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: '0.5rem'}} onClick={() => handleEdit(s)}>EDIT</button>
                <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'red', borderColor: 'red'}} onClick={() => handleDelete(s.screenId)}>DEL</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminScreens;
