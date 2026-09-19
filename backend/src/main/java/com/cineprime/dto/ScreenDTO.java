package com.cineprime.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreenDTO {
    private Long screenId;
    private Long theatreId;
    private String screenName;
    private String screenType;
    private Integer capacity;
}
