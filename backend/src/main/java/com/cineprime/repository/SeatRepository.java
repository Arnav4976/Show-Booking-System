package com.cineprime.repository;

import com.cineprime.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByScreenId(Long screenId);
    Optional<Seat> findByScreenIdAndSeatIdentifier(Long screenId, String seatIdentifier);
}
