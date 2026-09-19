package com.cineprime.service;

import com.cineprime.dto.TheatreDTO;
import com.cineprime.entity.Theatre;
import com.cineprime.exception.ResourceNotFoundException;
import com.cineprime.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheatreService {
    private final TheatreRepository repository;

    public TheatreDTO mapToDTO(Theatre t) {
        return TheatreDTO.builder()
                .theatreId(t.getId())
                .theatreName(t.getTheatreName())
                .city(t.getCity())
                .address(t.getAddress())
                .build();
    }

    public List<TheatreDTO> getAll() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public TheatreDTO getById(Long id) {
        return repository.findById(id).map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found"));
    }

    public TheatreDTO create(TheatreDTO dto) {
        Theatre t = Theatre.builder()
                .theatreName(dto.getTheatreName())
                .city(dto.getCity())
                .address(dto.getAddress())
                .build();
        return mapToDTO(repository.save(t));
    }

    public TheatreDTO update(Long id, TheatreDTO dto) {
        Theatre t = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found"));
        t.setTheatreName(dto.getTheatreName());
        t.setCity(dto.getCity());
        t.setAddress(dto.getAddress());
        return mapToDTO(repository.save(t));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Theatre not found");
        repository.deleteById(id);
    }
}
