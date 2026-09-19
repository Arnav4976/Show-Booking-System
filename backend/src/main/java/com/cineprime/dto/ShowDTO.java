package com.cineprime.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowDTO {
    private Long showId;
    private Long movieId;
    private Long theatreId; // Nested manually
    private Long screenId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal price;

    private TheatreDTO theatre;
    private ScreenDTO screen;
}
