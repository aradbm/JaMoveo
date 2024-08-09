import { useState } from "react";
import { API_URL } from "../config";
// import "./SongSearch.css";

type SongSearchProps = {
  onSongSelect: (songId: string) => void;
};

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
          <button onClick={handleSearch} className="button">
            Search
          </button>
        </div>
        {results.length > 0 && (
          <ul className="search-results">
            {results.map((result) => (
              <li
                key={result.title}
                onClick={() => onSongSelect(result.title)}
                className="search-result-item"
              >
                <span className="result-title">{result.title}</span>
                <span className="result-preview">{result.preview}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SongSearch;
