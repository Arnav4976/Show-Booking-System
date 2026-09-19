package com.cineprime.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowSeatsResponseDTO {
    private String layoutType;
    private Object layoutConfig; // Currently frontend calculates this, we can return null or raw layout mapping
    private List<SeatDTO> seats;
}
