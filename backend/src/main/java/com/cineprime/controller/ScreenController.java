package com.cineprime.controller;

import com.cineprime.dto.ScreenDTO;
import com.cineprime.dto.SeatDTO;
import com.cineprime.service.ScreenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ScreenController {
    private final ScreenService service;

    @GetMapping("/screens")
    public ResponseEntity<List<ScreenDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/theatres/{theatreId}/screens")
    public ResponseEntity<List<ScreenDTO>> getByTheatreId(@PathVariable Long theatreId) {
        return ResponseEntity.ok(service.getByTheatreId(theatreId));
    }

    @GetMapping("/screens/{id}/seats")
    public ResponseEntity<List<SeatDTO>> getSeats(@PathVariable Long id) {
        return ResponseEntity.ok(service.getSeats(id));
    }

    @PostMapping("/screens")
    public ResponseEntity<ScreenDTO> create(@RequestBody ScreenDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/screens/{id}")
    public ResponseEntity<ScreenDTO> update(@PathVariable Long id, @RequestBody ScreenDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/screens/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
