import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img src={movie.posterUrl || movie.poster} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h3 className="serif">{movie.title}</h3>
        <p className="genre mono">{movie.genre} &middot; {movie.duration}</p>
        <div className="card-footer mono">
          GET TICKETS &rarr;
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
