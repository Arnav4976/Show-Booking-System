package com.cineprime.controller;

import com.cineprime.dto.ShowDTO;
import com.cineprime.dto.ShowSeatsResponseDTO;
import com.cineprime.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
public class ShowController {
    private final ShowService service;

    @GetMapping
    public ResponseEntity<List<ShowDTO>> getAll(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long theatreId) {
        
        if (movieId != null) return ResponseEntity.ok(service.getByMovieId(movieId));
        if (theatreId != null) return ResponseEntity.ok(service.getByTheatreId(theatreId));
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<ShowSeatsResponseDTO> getSeatsForShow(@PathVariable Long id) {
        return ResponseEntity.ok(service.getSeatsForShow(id));
    }

    @PostMapping
    public ResponseEntity<ShowDTO> create(@RequestBody ShowDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShowDTO> update(@PathVariable Long id, @RequestBody ShowDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
