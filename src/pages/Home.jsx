import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { MovieService } from '../services/api';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MovieService.getAll().then(data => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  const nowShowing = movies.filter(m => m.status === 'Now Showing');
  const comingSoon = movies.filter(m => m.status === 'Coming Soon');

  return (
    <>
      <Navbar />
      <div className="page-container container">
        <div className="home-header">
          <h1 className="page-title serif">TODAY'S PROGRAMME</h1>
          <div className="date-badge mono">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
          </div>
        </div>

        {loading ? (
          <div className="loading mono">CHECKING PROJECTOR...</div>
        ) : (
          <>
            <div className="section-header mono">
              <h2>NOW SHOWING</h2>
            </div>
            <div className="movies-grid">
              {nowShowing.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            <div className="section-header mono" style={{marginTop: '4rem'}}>
              <h2>COMING SOON</h2>
            </div>
            <div className="movies-grid">
              {comingSoon.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
