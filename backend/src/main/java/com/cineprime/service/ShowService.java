package com.cineprime.service;

import com.cineprime.dto.ScreenDTO;
import com.cineprime.dto.TheatreDTO;
import com.cineprime.dto.ShowDTO;
import com.cineprime.dto.SeatDTO;
import com.cineprime.dto.ShowSeatsResponseDTO;
import com.cineprime.entity.Show;
import com.cineprime.entity.Movie;
import com.cineprime.entity.Screen;
import com.cineprime.entity.BookingSeat;
import com.cineprime.exception.ResourceNotFoundException;
import com.cineprime.repository.ShowRepository;
import com.cineprime.repository.MovieRepository;
import com.cineprime.repository.ScreenRepository;
import com.cineprime.repository.SeatRepository;
import com.cineprime.repository.BookingSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowService {
    private final ShowRepository repository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public ShowDTO mapToDTO(Show s) {
        TheatreDTO tDto = TheatreDTO.builder()
            .theatreId(s.getScreen().getTheatre().getId())
            .theatreName(s.getScreen().getTheatre().getTheatreName())
            .city(s.getScreen().getTheatre().getCity())
            .address(s.getScreen().getTheatre().getAddress())
            .build();
            
        ScreenDTO sDto = ScreenDTO.builder()
            .screenId(s.getScreen().getId())
            .theatreId(s.getScreen().getTheatre().getId())
            .screenName(s.getScreen().getScreenName())
            .screenType(s.getScreen().getScreenType())
            .capacity(s.getScreen().getCapacity())
            .build();

        return ShowDTO.builder()
                .showId(s.getId())
                .movieId(s.getMovie().getId())
                .screenId(s.getScreen().getId())
                .theatreId(s.getScreen().getTheatre().getId())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .price(s.getPrice())
                .theatre(tDto)
                .screen(sDto)
                .build();
    }

    public List<ShowDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ShowDTO> getByMovieId(Long movieId) {
        return repository.findByMovieId(movieId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ShowDTO> getByTheatreId(Long theatreId) {
        return repository.findByScreenTheatreId(theatreId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ShowDTO getById(Long id) {
        return repository.findById(id).map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found"));
    }

    public ShowSeatsResponseDTO getSeatsForShow(Long id) {
        Show show = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Show not found"));
        
        // 1. Get all physical seats for this screen
        List<SeatDTO> allSeats = seatRepository.findByScreenId(show.getScreen().getId()).stream()
            .map(seat -> SeatDTO.builder()
                .seatId(seat.getSeatIdentifier())
                .row(seat.getRowIdentifier())
                .status("available")
                .build())
            .collect(Collectors.toList());
            
        // 2. Find which ones are occupied for THIS show
        Set<String> occupiedSeatIds = bookingSeatRepository.findByShowId(id).stream()
            .map(bs -> bs.getSeat().getSeatIdentifier())
            .collect(Collectors.toSet());
            
        // 3. Mark them
        for(SeatDTO seat : allSeats) {
            if(occupiedSeatIds.contains(seat.getSeatId())) {
                seat.setStatus("occupied");
            }
        }
        
        return ShowSeatsResponseDTO.builder()
            .layoutType(show.getScreen().getScreenType())
            .layoutConfig(null) // Handled by frontend helper
            .seats(allSeats)
            .build();
    }

    public ShowDTO create(ShowDTO dto) {
        Movie m = movieRepository.findById(dto.getMovieId()).orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        Screen s = screenRepository.findById(dto.getScreenId()).orElseThrow(() -> new ResourceNotFoundException("Screen not found"));
        
        Show show = Show.builder()
            .movie(m)
            .screen(s)
            .startTime(dto.getStartTime())
            .endTime(dto.getEndTime())
            .price(dto.getPrice())
            .build();
        return mapToDTO(repository.save(show));
    }

    public ShowDTO update(Long id, ShowDTO dto) {
        Show show = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Show not found"));
        show.setStartTime(dto.getStartTime());
        show.setEndTime(dto.getEndTime());
        show.setPrice(dto.getPrice());
        
        if(!show.getMovie().getId().equals(dto.getMovieId())) {
             Movie m = movieRepository.findById(dto.getMovieId()).orElseThrow();
             show.setMovie(m);
        }
        if(!show.getScreen().getId().equals(dto.getScreenId())) {
             Screen s = screenRepository.findById(dto.getScreenId()).orElseThrow();
             show.setScreen(s);
        }
        return mapToDTO(repository.save(show));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Show not found");
        repository.deleteById(id);
    }
}
