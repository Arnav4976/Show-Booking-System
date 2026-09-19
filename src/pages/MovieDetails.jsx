import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MovieService, ShowService } from '../services/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([MovieService.getById(id), ShowService.getByMovieId(id)])
      .then(([movieData, showsData]) => {
        setMovie(movieData);
        setShows(showsData);
        setLoading(false);
      });
  }, [id]);

  const handleShowSelect = (show) => {
    navigate(`/seat-selection`, { state: { movie, show } });
  };

  if (loading) return <><Navbar /><div className="loading mono container">LOADING FILM DETAILS...</div></>;
  if (!movie) return <><Navbar /><div className="loading mono container">FILM NOT FOUND.</div></>;

  return (
    <>
      <Navbar />
      <div className="movie-details-container container">
        <div className="layout-grid">
          
          <div className="movie-sidebar">
             <img src={movie.posterUrl || movie.poster} alt={movie.title} className="detail-poster" />
             <div className="movie-metadata mono">
               <p>GENRE: {movie.genre}</p>
               <p>RUNTIME: {movie.duration}</p>
             </div>
          </div>
          
          <div className="movie-main">
            <h1 className="serif">{movie.title}</h1>
            <p className="description">{movie.description}</p>
            
            <div className="ticket-action-area">
              <h3 className="mono section-title">AVAILABLE SHOWTIMES</h3>
              {shows.length > 0 ? (
                <div className="shows-list">
                  {shows.map(show => {
                    const time = new Date(show.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    return (
                      <button key={show.showId} className="btn show-btn" onClick={() => handleShowSelect(show)}>
                        <span className="show-time">{time}</span>
                        <span className="show-theater">{show.theatre.theatreName.toUpperCase()}</span>
                        <span className="show-meta mono" style={{fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.8}}>
                          {show.theatre.city} &middot; {show.screen.screenType.replace('_',' ')}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="mono">NO SCREENINGS SCHEDULED.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
