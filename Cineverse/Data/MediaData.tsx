
export type MediaData = {
  id: string;
  title: string;
  type: number;
  releaseDate: string;
  rating: number;
  mediaDescription: string;
  stars: number;
  priceLevel: number;
  likes: number;
  dislikes: number;
  image: string;
  episodeNumber: number;
};

const mediaData: MediaData[] = [
    {
      id: "1",
      title: "Inception",
      type: 1,
      releaseDate: "07/16/2010",
      rating: 4.5,
      mediaDescription: "Mind-bending thriller",
      stars: 5,
      priceLevel: 2,
      likes: 1000,
      dislikes: 50,
      image: "",
      episodeNumber: 1
    },
    {
      id: "2",
      title: "The Shawshank Redemption",
      type: 1,
      releaseDate: "09/23/2005",
      rating: 4.8,
      mediaDescription: "Drama, crime",
      stars: 5,
      priceLevel: 1,
      likes: 1200,
      dislikes: 30,
      image: "",
      episodeNumber: 1
    },
    {
      id: "3",
      title: "The Dark Knight",
      type: 1,
      releaseDate: "07/19/2009",
      rating: 4.7,
      mediaDescription: "Action, crime",
      stars: 5,
      priceLevel: 2,
      likes: 1100,
      dislikes: 40,
      image: "",
      episodeNumber: 1
    },
    {
      id: "4",
      title: "Stranger Things",
      type: 2,
      releaseDate: "07/15/2016",
      rating: 4.2,
      mediaDescription: "Sci-Fi, horror",
      stars: 4,
      priceLevel: 1,
      likes: 800,
      dislikes: 80,
      image: "",
      episodeNumber: 34
    },
    {
      id: "5",
      title: "Breaking Bad",
      type: 2,
      releaseDate: "12/08/2000",
      rating: 4.6,
      mediaDescription: "Crime, drama, thriller",
      stars: 4.5,
      priceLevel: 2,
      likes: 900,
      dislikes: 60,
      image: "",
      episodeNumber: 62
    },
    {
      id: "6",
      title: "The Matrix",
      type: 1,
      releaseDate: "03/31/1999",
      rating: 4.4,
      mediaDescription: "Action, sci-fi",
      stars: 4.5,
      priceLevel: 2,
      likes: 950,
      dislikes: 70,
      image: "",
      episodeNumber: 1
    },
  ];

export default mediaData;
