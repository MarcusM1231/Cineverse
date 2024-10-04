export interface Comment {
    id: string;
    commentText: string;
    likes: number;
    dislikes: number;
    userId: string;
    username: string;
    timestamp: string;
    flags: number;
    publicSpoiler: boolean;
    episodeId: number;
    orginalCommentId: string;
    replies: Comment[];
    type: number;
  }