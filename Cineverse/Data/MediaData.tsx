//Not used anymore 

// export type MediaData = {
//   id: string;
//   title: string;
//   type: number;
//   releaseDate: string;
//   rating: number;
//   mediaSummary: string;
//   likes: number;
//   dislikes: number;
//   image: string;
//   episodeNumber: number;
//   likedAlready: boolean;
//   dislikedAlready: boolean;
// };

// const mediaData: MediaData[] = [
//     {
//       id: "1",
//       title: "Inception",
//       type: 1,
//       releaseDate: "07/16/2010",
//       rating: 4.5,
//       mediaSummary: "A mind-bending thriller directed by Christopher Nolan. The film delves into the world of dreams as skilled thief Dom Cobb, played by Leonardo DiCaprio, leads a team to infiltrate the subconscious and steal secrets. The narrative weaves through layers of reality, challenging the boundaries between dreams and waking life.",
//       likes: 1000,
//       dislikes: 50,
//       image: "https://m.media-amazon.com/images/I/71uKM+LdgFL._AC_UF894,1000_QL80_.jpg",
//       episodeNumber: 1,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "2",
//       title: "The Shawshank Redemption",
//       type: 1,
//       releaseDate: "09/23/2005",
//       rating: 4.8,
//       mediaSummary: "A poignant drama set in Shawshank Penitentiary. It follows the story of Andy Dufresne, a banker wrongly convicted of murder, as he builds enduring friendships and seeks redemption within the harsh confines of prison life.",
//       likes: 1200,
//       dislikes: 30,
//       image: "https://m.media-amazon.com/images/I/51rXi2SXCXL._AC_UF894,1000_QL80_.jpg",
//       episodeNumber: 1,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "3",
//       title: "The Dark Knight",
//       type: 1,
//       releaseDate: "07/19/2009",
//       rating: 4.7,
//       mediaSummary: "A gripping action-crime film that pits Batman, portrayed by Christian Bale, against the anarchic Joker, played by Heath Ledger. The movie explores the moral complexities of heroism as the Dark Knight confronts a nemesis who thrives on chaos.",
//       likes: 1100,
//       dislikes: 40,
//       image: "https://m.media-amazon.com/images/I/61zBUhQj22L._AC_UF894,1000_QL80_.jpg",
//       episodeNumber: 1,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "4",
//       title: "Stranger Things",
//       type: 0,
//       releaseDate: "07/15/2016",
//       rating: 4.2,
//       mediaSummary: "A captivating sci-fi horror series created by the Duffer Brothers. Set in the 1980s, it follows a group of kids in Hawkins, Indiana, as they encounter supernatural phenomena, government experiments, and a girl with psychokinetic abilities. The series is a nostalgic homage to '80s pop culture.",
//       likes: 800,
//       dislikes: 80,
//       image: "https://m.media-amazon.com/images/I/81qv3rCbPwL._AC_UF894,1000_QL80_.jpg",
//       episodeNumber: 34,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "5",
//       title: "Breaking Bad",
//       type: 0,
//       releaseDate: "12/08/2000",
//       rating: 4.6,
//       mediaSummary: "A compelling crime drama that traces the transformation of Walter White, a high school chemistry teacher turned methamphetamine producer. The series explores the consequences of his choices and the impact on those around him, with Bryan Cranston delivering a stellar performance.",
//       likes: 900,
//       dislikes: 60,
//       image: "https://m.media-amazon.com/images/I/51fWOBx3agL._AC_UF894,1000_QL80_.jpg",
//       episodeNumber: 62,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "6",
//       title: "The Matrix",
//       type: 1,
//       releaseDate: "03/31/1999",
//       rating: 4.4,
//       mediaSummary: "A groundbreaking action sci-fi film. Starring Keanu Reeves as Neo, it follows the journey of a computer hacker who discovers the unsettling truth about reality. The film's iconic visuals and philosophical themes have left an indelible mark on popular culture.",
//       likes: 950,
//       dislikes: 70,
//       image: "https://m.media-amazon.com/images/I/51unGrb-AAL._AC_.jpg",
//       episodeNumber: 1,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "7",
//       title: "The Witcher",
//       type: 0,
//       releaseDate: "12/20/2019",
//       rating: 4.5,
//       mediaSummary: "Based on the book series by Andrzej Sapkowski, 'The Witcher' follows Geralt of Rivia, a monster hunter for hire, as he navigates a world filled with political intrigue, magic, and dangerous creatures.",
//       likes: 850,
//       dislikes: 45,
//       image: "https://m.media-amazon.com/images/I/81TUfw3vc7L._AC_UF894,1000_QL80_.jpg",
//       episodeNumber: 16,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "8",
//       title: "Stranger Things 2",
//       type: 0,
//       releaseDate: "10/27/2017",
//       rating: 4.5,
//       mediaSummary: "The second season of 'Stranger Things' continues the supernatural adventures in Hawkins, Indiana. As the characters face new threats, the bond between them grows stronger.",
//       likes: 900,
//       dislikes: 55,
//       image: "https://m.media-amazon.com/images/I/81SG03G+g7L._AC_UF894,1000_QL80_.jpg",
//       episodeNumber: 9,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "9",
//       title: "Black Mirror",
//       type: 0,
//       releaseDate: "12/04/2011",
//       rating: 4.4,
//       mediaSummary: "An anthology series that explores the dark and often dystopian aspects of modern society and technology. Each episode tells a standalone story that reflects on the impact of technological advancements on human behavior.",
//       likes: 800,
//       dislikes: 40,
//       image: "https://www.themoviedb.org/t/p/original/upFjswDl7vIP7vGvly49x2PkUXc.jpg",
//       episodeNumber: 22,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//     {
//       id: "10",
//       title: "The Mandalorian",
//       type: 0,
//       releaseDate: "11/12/2019",
//       rating: 4.7,
//       mediaSummary: "Set in the Star Wars universe, 'The Mandalorian' follows the adventures of a lone bounty hunter in the outer reaches of the galaxy. The series introduces new characters and expands on the lore of the Star Wars franchise.",
//       likes: 950,
//       dislikes: 30,
//       image: "https://lumiere-a.akamaihd.net/v1/images/the-mandalorian-compilation-poster-fb-tw_6ae443d1.jpeg",
//       episodeNumber: 16,
//       likedAlready: false,
//       dislikedAlready: false
//     },
//   ];

//export default mediaData;
