export interface Comment {
    commentId: string;
    commentText: string;
    likes: number;
    dislikes: number;
    userId: string;
    username: string;
    timestamp: string;
    flags: number;
    markedSpoiler: boolean;
    episodeId: number
  }