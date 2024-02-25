export interface Comment {
    commentId: string;
    episodeId: string;
    datePosted: string;
    userId: string;
    flags: number;
    likes: number;
    commentText: string;
    dislikes: number;
    isSpoiler: boolean;
    likedAlready: boolean;
    dislikedAlready: boolean;
  }