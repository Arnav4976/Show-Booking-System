package com.cineprime.controller;

import com.cineprime.dto.BookingDTO;
import com.cineprime.dto.BookingRequestDTO;
import com.cineprime.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService service;

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/users/{userId}/bookings")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getUserBookings(userId));
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingDTO> create(@RequestBody BookingRequestDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
