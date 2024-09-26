export interface User {
    uid: string;
    username: string;
    email: string; 
    imageUrl?: string;
    following: number;
    followers: number;
    accountPrivacy: boolean // true = private | false = public
}