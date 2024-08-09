import { Song } from "../types";
import "./SongDisplay.css";

interface SongDisplayProps {
  song: Song;
  userInstrument: string;
}

// if userinstrument is vocal, then display the lyrics only, anyone else display the chords also
// above the lyric it should display the chord
const SongDisplay = ({ song, userInstrument }: SongDisplayProps) => {
  return <h1>hi!</h1>;
};

export default SongDisplay;
