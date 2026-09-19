package com.cineprime.service;

import com.cineprime.dto.ScreenDTO;
import com.cineprime.dto.SeatDTO;
import com.cineprime.entity.Screen;
import com.cineprime.entity.Theatre;
import com.cineprime.entity.Seat;
import com.cineprime.exception.ResourceNotFoundException;
import com.cineprime.repository.ScreenRepository;
import com.cineprime.repository.TheatreRepository;
import com.cineprime.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScreenService {
    private final ScreenRepository repository;
    private final TheatreRepository theatreRepository;
    private final SeatRepository seatRepository;

    public ScreenDTO mapToDTO(Screen s) {
        return ScreenDTO.builder()
                .screenId(s.getId())
                .theatreId(s.getTheatre().getId())
                .screenName(s.getScreenName())
                .screenType(s.getScreenType())
                .capacity(s.getCapacity())
                .build();
    }

    public List<ScreenDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ScreenDTO> getByTheatreId(Long theatreId) {
        return repository.findByTheatreId(theatreId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<SeatDTO> getSeats(Long screenId) {
        return seatRepository.findByScreenId(screenId).stream().map(seat -> 
            SeatDTO.builder()
                .seatId(seat.getSeatIdentifier())
                .row(seat.getRowIdentifier())
                .status("available")
                .build()
        ).collect(Collectors.toList());
    }

    public ScreenDTO create(ScreenDTO dto) {
        Theatre t = theatreRepository.findById(dto.getTheatreId())
            .orElseThrow(() -> new ResourceNotFoundException("Theatre not found"));
        Screen s = Screen.builder()
                .theatre(t)
                .screenName(dto.getScreenName())
                .screenType(dto.getScreenType())
                .capacity(dto.getCapacity() != null ? dto.getCapacity() : 36)
                .build();
        Screen savedScreen = repository.save(s);
        
        generateSeatsForScreen(savedScreen);
        
        return mapToDTO(savedScreen);
    }

    private void generateSeatsForScreen(Screen screen) {
        List<Seat> seats = new java.util.ArrayList<>();
        String type = screen.getScreenType();
        int cap = screen.getCapacity() != null ? screen.getCapacity() : 36;
        
        if ("THRUST".equals(type)) {
            String[] sides = {"L", "R", "F"};
            for (String side : sides) {
                for (int i = 1; i <= 3; i++) {
                    for (int j = 1; j <= 4; j++) {
                        String row = side + i;
                        seats.add(Seat.builder().screen(screen).rowIdentifier(row).seatIdentifier(row + "-" + j).build());
                    }
                }
            }
        } else if ("IN_THE_ROUND".equals(type)) {
            String[] sides = {"N", "S", "E", "W"};
            int seatsPerSide = (int) Math.ceil((double) cap / 4.0);
            for (String side : sides) {
                for (int i = 1; i <= seatsPerSide; i++) {
                    seats.add(Seat.builder().screen(screen).rowIdentifier(side).seatIdentifier(side + i).build());
                }
            }
        } else {
            int seatsPerRow = "CABARET".equals(type) ? 4 : 10;
            int numRows = (int) Math.ceil((double) cap / seatsPerRow);
            int count = 0;
            
            for (int i = 0; i < numRows; i++) {
                String r = String.valueOf((char) ('A' + i));
                for (int j = 1; j <= seatsPerRow; j++) {
                    if (count >= cap) break;
                    seats.add(Seat.builder().screen(screen).rowIdentifier(r).seatIdentifier(r + j).build());
                    count++;
                }
            }
        }
        seatRepository.saveAll(seats);
    }

    public ScreenDTO update(Long id, ScreenDTO dto) {
        Screen s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found"));
        s.setScreenName(dto.getScreenName());
        s.setScreenType(dto.getScreenType());
        s.setCapacity(dto.getCapacity());
        if (!s.getTheatre().getId().equals(dto.getTheatreId())) {
             Theatre t = theatreRepository.findById(dto.getTheatreId())
                 .orElseThrow(() -> new ResourceNotFoundException("Theatre not found"));
             s.setTheatre(t);
        }
        return mapToDTO(repository.save(s));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Screen not found");
        repository.deleteById(id);
    }
}
