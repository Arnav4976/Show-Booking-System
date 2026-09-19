package com.cineprime.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDTO {
    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private String language;
    private String genre;
    private String posterUrl;
    private Double rating;
    private String status;
}
