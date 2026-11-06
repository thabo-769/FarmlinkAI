declare module 'firebase/auth' {
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
    getIdToken?: () => Promise<string>;
    [key: string]: any;
  }

  export function getAuth(app?: any): any;
  export class GoogleAuthProvider {
    constructor();
    [key: string]: any;
  }
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signOut(auth: any): Promise<void>;
  export function onAuthStateChanged(auth: any, nextOrObserver: any, error?: any, completed?: any): () => void;
}
