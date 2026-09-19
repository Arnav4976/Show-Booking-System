package com.cineprime.service;

import com.cineprime.dto.BookingDTO;
import com.cineprime.dto.BookingRequestDTO;
import com.cineprime.entity.*;
import com.cineprime.exception.ResourceNotFoundException;
import com.cineprime.exception.ConflictException;
import com.cineprime.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final MovieService movieService;
    private final ShowService showService;

    public BookingDTO mapToDTO(Booking b) {
        List<String> seats = b.getBookingSeats().stream()
            .map(bs -> bs.getSeat().getSeatIdentifier())
            .collect(Collectors.toList());
            
        return BookingDTO.builder()
            .bookingId(b.getId())
            .userId(b.getUser().getId())
            .showId(b.getShow().getId())
            .bookingDate(b.getBookingDate())
            .selectedSeats(seats)
            .totalAmount(b.getTotalAmount())
            .bookingStatus(b.getBookingStatus())
            .movie(movieService.mapToDTO(b.getShow().getMovie()))
            .show(showService.mapToDTO(b.getShow()))
            .build();
    }

    public List<BookingDTO> getAll() {
        return bookingRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public BookingDTO getById(String id) {
        return bookingRepository.findById(id).map(this::mapToDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public BookingDTO create(BookingRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Show show = showRepository.findById(dto.getShowId())
            .orElseThrow(() -> new ResourceNotFoundException("Show not found"));

        String bookingId = "BK" + UUID.randomUUID().toString().substring(0, 9).toUpperCase();
        
        Booking booking = Booking.builder()
            .id(bookingId)
            .user(user)
            .show(show)
            .bookingDate(LocalDateTime.now())
            .totalAmount(dto.getTotalAmount())
            .bookingStatus("CONFIRMED")
            .build();
            
        // Look up each seat by identifier within this screen. 
        for(String seatIdStr : dto.getSelectedSeats()) {
            Seat seat = seatRepository.findByScreenIdAndSeatIdentifier(show.getScreen().getId(), seatIdStr)
                .orElseThrow(() -> new ResourceNotFoundException("Seat " + seatIdStr + " not found for this screen"));
                
            BookingSeat bs = BookingSeat.builder()
                .booking(booking)
                .show(show)
                .seat(seat)
                .build();
                
            booking.getBookingSeats().add(bs);
        }
        
        // This save will trigger cascade insert on booking_seats.
        // If another transaction inserted a booking for the same (show, seat) concurrently, 
        // the unique constraint (show_id, seat_id) on booking_seats will cause a DataIntegrityViolationException.
        return mapToDTO(bookingRepository.save(booking));
    }

    @Transactional
    public void delete(String id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
            
        booking.setBookingStatus("CANCELLED");
        // Clear the booking seats to release them for other bookings
        booking.getBookingSeats().clear();
        
        bookingRepository.save(booking);
    }
}
