package com.cineprime.service;

import com.cineprime.dto.MovieDTO;
import com.cineprime.entity.Movie;
import com.cineprime.exception.ResourceNotFoundException;
import com.cineprime.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final MovieRepository repository;

    public MovieDTO mapToDTO(Movie m) {
        return MovieDTO.builder()
                .id(m.getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .duration(m.getDuration())
                .language(m.getLanguage())
                .genre(m.getGenre())
                .posterUrl(m.getPosterUrl())
                .rating(m.getRating())
                .status(m.getStatus())
                .build();
    }

    public List<MovieDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public MovieDTO getById(Long id) {
        return repository.findById(id).map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
    }

    public MovieDTO create(MovieDTO dto) {
        Movie m = Movie.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .duration(dto.getDuration())
                .language(dto.getLanguage())
                .genre(dto.getGenre())
                .posterUrl(dto.getPosterUrl())
                .rating(dto.getRating())
                .status(dto.getStatus())
                .build();
        return mapToDTO(repository.save(m));
    }

    public MovieDTO update(Long id, MovieDTO dto) {
        Movie m = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        m.setTitle(dto.getTitle());
        m.setDescription(dto.getDescription());
        m.setDuration(dto.getDuration());
        m.setLanguage(dto.getLanguage());
        m.setGenre(dto.getGenre());
        m.setPosterUrl(dto.getPosterUrl());
        m.setRating(dto.getRating());
        m.setStatus(dto.getStatus());
        return mapToDTO(repository.save(m));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Movie not found");
        repository.deleteById(id);
    }
}
