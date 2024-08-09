import { useState } from "react";
import { API_URL } from "../config";

interface SongSearchProps {
  onSongSelect: (songId: string) => void;
}

const SongSearch = ({ onSongSelect }: SongSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{ title: string; preview: string }>
  >([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error("Search failed");
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a song"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result) => (
          <li key={result.title} onClick={() => onSongSelect(result.title)}>
            {result.title} - {result.preview}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongSearch;
