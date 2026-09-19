export const movies = [
  {
    id: 1,
    title: "Hamlet",
    description: "A stark reimagining of Shakespeare's classic play in an intimate setting.",
    genre: "Drama",
    language: "English",
    duration: "180 min",
    rating: "PG-13",
    releaseDate: "2026-08-15",
    poster: "https://image.tmdb.org/t/p/w500/A72BAMWiwYxWeY7P4E94P1aWj7I.jpg",
    status: "now-playing"
  },
  {
    id: 2,
    title: "Metropolis",
    description: "The pioneering sci-fi masterpiece with live orchestral accompaniment.",
    genre: "Sci-Fi, Classic",
    language: "Silent / English Intertitles",
    duration: "153 min",
    rating: "NR",
    releaseDate: "1927-01-10",
    poster: "https://image.tmdb.org/t/p/w500/8k1xL1i2L6C5N7TigEw1aPntQyN.jpg",
    status: "now-playing"
  },
  {
    id: 3,
    title: "Poetry Open Mic",
    description: "Local storytellers and poets gather for an evening of spoken word.",
    genre: "Live Event",
    language: "English",
    duration: "120 min",
    rating: "NR",
    releaseDate: "2026-09-01",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88ILqP7kEIvVOKtl2BGLb.jpg",
    status: "now-playing"
  },
  {
    id: 4,
    title: "A Midsummer Night's Dream",
    description: "An outdoor immersive experience of the classic comedy.",
    genre: "Comedy",
    language: "English",
    duration: "150 min",
    rating: "PG",
    releaseDate: "2026-09-10",
    poster: "https://image.tmdb.org/t/p/w500/AJoGlsP1XpW5B1F9g60s5TjJ3p2.jpg",
    status: "upcoming"
  }
];

export const theatres = [
  { theatreId: 1, theatreName: "CinePrime Main Hall", theatreType: "PROSCENIUM", location: "Downtown" },
  { theatreId: 2, theatreName: "CinePrime Studio", theatreType: "BLACK_BOX", location: "Uptown" },
  { theatreId: 3, theatreName: "The Courtyard", theatreType: "AMPHITHEATRE", location: "Eastside" },
  { theatreId: 4, theatreName: "The Loft", theatreType: "BAITHAK", location: "Westside" }
];

export const screens = [
  { screenId: 10, theatreId: 1, screenName: "Stage A", screenType: "END_STAGE" },
  { screenId: 20, theatreId: 2, screenName: "Black Box 1", screenType: "THRUST" },
  { screenId: 21, theatreId: 2, screenName: "Black Box 2", screenType: "IN_THE_ROUND" },
  { screenId: 22, theatreId: 2, screenName: "Lounge", screenType: "CABARET" },
  { screenId: 30, theatreId: 3, screenName: "Open Air", screenType: "SEMI_CIRCLE" },
  { screenId: 40, theatreId: 4, screenName: "Floor 1", screenType: "FLOOR_SEATING" }
];

export const shows = [
  { showId: 101, movieId: 1, theatreId: 2, screenId: 20, date: "2026-09-03", startTime: "2026-09-03T20:00:00", endTime: "2026-09-03T23:00:00", ticketPrice: 20 },
  { showId: 102, movieId: 1, theatreId: 2, screenId: 21, date: "2026-09-04", startTime: "2026-09-04T19:00:00", endTime: "2026-09-04T22:00:00", ticketPrice: 20 },
  { showId: 103, movieId: 1, theatreId: 1, screenId: 10, date: "2026-09-05", startTime: "2026-09-05T18:00:00", endTime: "2026-09-05T21:00:00", ticketPrice: 15 },
  { showId: 201, movieId: 2, theatreId: 1, screenId: 10, date: "2026-09-03", startTime: "2026-09-03T18:30:00", endTime: "2026-09-03T21:00:00", ticketPrice: 18 },
  { showId: 202, movieId: 2, theatreId: 2, screenId: 22, date: "2026-09-06", startTime: "2026-09-06T21:00:00", endTime: "2026-09-06T23:30:00", ticketPrice: 25 },
  { showId: 301, movieId: 3, theatreId: 4, screenId: 40, date: "2026-09-04", startTime: "2026-09-04T20:30:00", endTime: "2026-09-04T22:30:00", ticketPrice: 10 },
  { showId: 401, movieId: 4, theatreId: 3, screenId: 30, date: "2026-09-10", startTime: "2026-09-10T19:00:00", endTime: "2026-09-10T21:30:00", ticketPrice: 22 }
];

export const getArrangementConfig = (screenType) => {
  switch (screenType) {
    case 'END_STAGE':
      return { type: 'END_STAGE', rows: ['A', 'B', 'C', 'D'], blocks: [3, 4, 3] };
    case 'SEMI_CIRCLE':
      return { type: 'SEMI_CIRCLE', rows: ['A', 'B', 'C', 'D', 'E'], expansion: 2 };
    case 'FLOOR_SEATING':
      return { type: 'FLOOR_SEATING', clusters: 4, seatsPerCluster: 6 };
    case 'THRUST':
      return { type: 'THRUST', sides: { left: 4, right: 4, front: 6 }, rowsDeep: 3 }; 
    case 'IN_THE_ROUND':
      return { type: 'IN_THE_ROUND', sides: { top: 4, bottom: 4, left: 3, right: 3 }, rowsDeep: 2 };
    case 'CABARET':
      return { type: 'CABARET', tables: 6, seatsPerTable: 4 };
    default:
      return { type: 'END_STAGE', rows: ['A', 'B', 'C'], blocks: [3, 3, 3] };
  }
};

export const screenSeats = {};
screens.forEach(screen => {
  const map = [];
  const addSeat = (id, row, seatNumber, category, price) => {
     map.push({ seatId: id, screenId: screen.screenId, row, seatNumber, category, price });
  };
  
  const config = getArrangementConfig(screen.screenType);
  
  if (config.type === 'END_STAGE') {
     config.rows.forEach(r => {
        let count = 1;
        config.blocks.forEach(b => {
           for(let i=0; i<b; i++){ addSeat(`${r}${count}`, r, count++, "STANDARD", 0); }
        });
     });
  } else if (config.type === 'SEMI_CIRCLE') {
     let base = 5;
     config.rows.forEach(r => {
        for(let i=1; i<=base; i++){ addSeat(`${r}${i}`, r, i, "STANDARD", 0); }
        base += config.expansion;
     });
  } else if (config.type === 'FLOOR_SEATING') {
     for(let c=1; c<=config.clusters; c++) {
        for(let s=1; s<=config.seatsPerCluster; s++){ addSeat(`F${c}-${s}`, `F${c}`, s, "FLOOR", 0); }
     }
  } else if (config.type === 'THRUST') {
     ['L','R','F'].forEach(sideStr => {
        const sidePrefix = sideStr.charAt(0);
        const count = config.sides[sideStr === 'L' ? 'left' : sideStr === 'R' ? 'right' : 'front'];
        for(let r=1; r<=config.rowsDeep; r++) {
           for(let i=1; i<=count; i++) addSeat(`${sidePrefix}${r}-${i}`, `${sidePrefix}${r}`, i, "STANDARD", 0);
        }
     });
  } else if (config.type === 'IN_THE_ROUND') {
      ['North','South','East','West'].forEach(dir => {
        const dirPre = dir.charAt(0);
        let count = (dir === 'North' || dir === 'South') ? config.sides.top : config.sides.left;
        for(let r=1; r<=config.rowsDeep; r++) {
           for(let i=1; i<=count; i++) addSeat(`${dirPre}${r}-${i}`, `${dirPre}${r}`, i, "STANDARD", 0);
        }
      });
  } else if (config.type === 'CABARET') {
      for(let t=1; t<=config.tables; t++) {
        for(let s=1; s<=config.seatsPerTable; s++) addSeat(`T${t}-${s}`, `T${t}`, s, "TABLE", 0);
      }
  }

  screenSeats[screen.screenId] = map;
});

// To maintain realistic mock behavior, we generate random occupancies for specific shows
export const showOccupancy = {};
shows.forEach(show => {
  const seats = screenSeats[show.screenId];
  if(seats) {
      showOccupancy[show.showId] = seats.map(s => ({
          seatId: s.seatId,
          status: Math.random() > 0.75 ? 'occupied' : 'available'
      }));
  }
});

export const myBookingsList = [];
