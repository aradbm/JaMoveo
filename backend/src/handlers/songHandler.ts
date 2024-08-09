import { WebSocket } from "ws";
import { UpdateSongMessage } from "../types/weMessage";
import { fetchSongFromFile } from "../utils/songUtils";
import { broadcastCurrentSong } from "../utils/broadcastUtils";

export const handleSongSelected = async (
  message: UpdateSongMessage,
  setCurrentSong: (song: any) => void,
  connections: Map<string, WebSocket>
) => {
  const { songId } = message;
  if (songId) {
    try {
      const song = await fetchSongFromFile(songId);
      setCurrentSong(song);
      console.log("Selected song:", song);
    } catch (error) {
      console.error("Error fetching song:", error);
      return;
    }
  } else {
    setCurrentSong(undefined);
  }
  broadcastCurrentSong(connections, setCurrentSong);
  console.log("Broadcasted current song");
};
