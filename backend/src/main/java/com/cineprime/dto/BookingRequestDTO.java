package com.cineprime.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequestDTO {
    private Long userId;
    private Long showId;
    private List<String> selectedSeats;
    private BigDecimal totalAmount;
}
