package com.cineprime.config;

import com.cineprime.entity.*;
import com.cineprime.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile("!production") // Ensures this doesn't run in production unexpectedly
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (movieRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping seed process.");
            return;
        }
        System.out.println("Initializing CinePrime database with realistic seed data...");

        // 1. Seed Users
        User admin = User.builder().username("admin").email("admin@cineprime.local").roles("ROLE_ADMIN").build();
        User guest = User.builder().username("guest_user").email("guest@cineprime.local").roles("ROLE_USER").build();
        userRepository.saveAll(List.of(admin, guest));

        // 2. Seed Movies
        Movie m1 = Movie.builder()
                .title("Hamlet")
                .description("A stark reimagining of Shakespeare's classic play in an intimate setting.")
                .genre("Drama")
                .language("English")
                .duration(180)
                .rating(4.8)
                .posterUrl("https://upload.wikimedia.org/wikipedia/en/5/5e/Hamlet_a192cc9d.png")
                .status("Now Showing")
                .build();

        Movie m2 = Movie.builder()
                .title("Metropolis")
                .description("The pioneering sci-fi masterpiece with live orchestral accompaniment.")
                .genre("Sci-Fi, Classic")
                .language("Silent")
                .duration(153)
                .rating(4.9)
                .posterUrl("https://upload.wikimedia.org/wikipedia/en/9/97/Metropolis_%28German_three-sheet_poster%29.jpg")
                .status("Now Showing")
                .build();

        Movie m3 = Movie.builder()
                .title("A Midsummer Night's Dream")
                .description("An outdoor immersive experience of the classic comedy.")
                .genre("Comedy")
                .language("English")
                .duration(150)
                .rating(4.5)
                .posterUrl("https://upload.wikimedia.org/wikipedia/en/4/43/A_Midsummer_Night%27s_Dream_Poster.jpg")
                .status("Coming Soon")
                .build();

        movieRepository.saveAll(List.of(m1, m2, m3));

        // 3. Seed Theatres
        Theatre t1 = Theatre.builder().theatreName("CinePrime Main Hall").city("Downtown").address("123 Main St").build();
        Theatre t2 = Theatre.builder().theatreName("CinePrime Studio").city("Uptown").address("456 Broad St").build();
        theatreRepository.saveAll(List.of(t1, t2));

        // 4. Seed Screens
        Screen s1 = Screen.builder().theatre(t1).screenName("Stage A").screenType("END_STAGE").capacity(36).build();
        Screen s2 = Screen.builder().theatre(t2).screenName("Black Box 1").screenType("THRUST").capacity(42).build();
        screenRepository.saveAll(List.of(s1, s2));

        // 5. Seed Seats for Screen 1 (END_STAGE style)
        List<Seat> seats1 = new ArrayList<>();
        String[] rows = {"A", "B", "C", "D"};
        for (String r : rows) {
            for (int i = 1; i <= 9; i++) {
                seats1.add(Seat.builder().screen(s1).rowIdentifier(r).seatIdentifier(r + i).build());
            }
        }
        seatRepository.saveAll(seats1);

        // Seed Seats for Screen 2 (THRUST style - simplified)
        List<Seat> seats2 = new ArrayList<>();
        String[] sides = {"L", "R", "F"}; // Left, Right, Front
        for (String side : sides) {
            for (int i = 1; i <= 3; i++) { // 3 rows deep
                for (int j = 1; j <= 4; j++) { // 4 seats wide
                    String row = side + i;
                    seats2.add(Seat.builder().screen(s2).rowIdentifier(row).seatIdentifier(row + "-" + j).build());
                }
            }
        }
        seatRepository.saveAll(seats2);

        // 6. Seed Shows
        Show sh1 = Show.builder()
                .movie(m1)
                .screen(s1)
                .startTime(LocalDateTime.now().plusDays(1).withHour(18).withMinute(0))
                .endTime(LocalDateTime.now().plusDays(1).withHour(21).withMinute(0))
                .price(new BigDecimal("20.00"))
                .build();

        Show sh2 = Show.builder()
                .movie(m2)
                .screen(s2)
                .startTime(LocalDateTime.now().plusDays(2).withHour(19).withMinute(0))
                .endTime(LocalDateTime.now().plusDays(2).withHour(21).withMinute(30))
                .price(new BigDecimal("15.00"))
                .build();
                
        Show sh3 = Show.builder()
                .movie(m3)
                .screen(s1)
                .startTime(LocalDateTime.now().plusDays(3).withHour(20).withMinute(0))
                .endTime(LocalDateTime.now().plusDays(3).withHour(22).withMinute(30))
                .price(new BigDecimal("25.00"))
                .build();

        showRepository.saveAll(List.of(sh1, sh2, sh3));

        System.out.println("Seed complete!");
    }
}
