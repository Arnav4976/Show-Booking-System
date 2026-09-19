package com.cineprime.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private String bookingId;
    private Long userId;
    private Long showId;
    private LocalDateTime bookingDate;
    private List<String> selectedSeats;
    private BigDecimal totalAmount;
    private String bookingStatus;

    // Enriched fields expected by frontend
    private MovieDTO movie;
    private ShowDTO show;
}
