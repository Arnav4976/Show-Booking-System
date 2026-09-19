package com.cineprime.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatDTO {
    private String seatId; // Mapped from seatIdentifier
    private String row; // Mapped from rowIdentifier
    private String status;
}
