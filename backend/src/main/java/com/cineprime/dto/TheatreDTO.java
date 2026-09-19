package com.cineprime.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreDTO {
    private Long theatreId; // Frontend expects theatreId
    private String theatreName;
    private String city;
    private String address;
}
