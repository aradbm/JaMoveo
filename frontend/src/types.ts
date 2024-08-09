export type Instrument =
  | "guitar"
  | "bass"
  | "drums"
  | "vocals"
  | "keyboard"
  | "saxophone";

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  instrument: Instrument;
}

export type Song = Array<Array<{ lyrics: string; chords?: string }>>;

export type ConnectedUser = [username: string, instrument: string];
