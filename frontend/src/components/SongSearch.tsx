import { useState } from "react";
import { API_URL } from "../config";

type SongSearchProps = {
  onSongSelect: (songId: string) => Promise<void>; // Changed to return a Promise
};

type SongSearchResult = {
  songName: string;
  artistName: string;
  url: string;
};

const SongSearch = ({ onSongSelect }: SongSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SongSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSong, setIsLoadingSong] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);

    try {
      const response = await fetch(
        `${API_URL}/tabsearch?q=${encodeURIComponent(query)}`
      );
      console.log("response:   ", response);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error("Search failed");
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSongSelect = async (url: string) => {
    setIsLoadingSong(true);
    try {
      await onSongSelect(url);
    } catch (error) {
      console.error("Error loading song:", error);
      setIsLoadingSong(false); // Reset loading state if there's an error
    }
  };

  return (
    <div className="song-search-wrapper">
      <div className="song-search">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a song"
            className="search-input"
          />
          <div style={{ width: "10px" }} />
          <button
            onClick={handleSearch}
            className={`button ${isSearching ? "loading" : ""}`}
            disabled={isSearching || isLoadingSong}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {isLoadingSong && (
          <div className="loading-indicator">Loading selected song...</div>
        )}
        {!isSearching && !isLoadingSong && results.length > 0 && (
          <ul className="search-results">
            {results.map((result) => (
              <li
                key={result.url}
                onClick={() => handleSongSelect(result.url)}
                className="search-result-item"
              >
                <span className="result-title">{result.songName}</span>
                <span className="result-preview">{result.artistName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SongSearch;
