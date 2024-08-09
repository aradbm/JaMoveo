import React, { CSSProperties, useRef, useState, useEffect } from "react";
import { Song } from "../types";
import "./SongDisplay.css";

type SongDisplayProps = {
  song: Song;
  userInstrument: string;
};

const SongDisplay = ({ song, userInstrument }: SongDisplayProps) => {
  const showChords = userInstrument !== "vocals";
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const songDisplayRef = useRef<HTMLDivElement>(null);

  const isRTL = (text: string) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlChars.test(text);
  };

  const addSpaceBetweenWords = (text: string, nextText: string | undefined) => {
    if (!nextText) return text;
    const lastChar = text[text.length - 1];
    const nextChar = nextText[0];
    if (
      (lastChar.match(/\w/) && nextChar.match(/\w/)) ||
      (isRTL(lastChar) && isRTL(nextChar))
    ) {
      return text + " ";
    }
    return text;
  };

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;

    if (isAutoScrolling && songDisplayRef.current) {
      scrollInterval = setInterval(() => {
        if (songDisplayRef.current) {
          songDisplayRef.current.scrollTop += scrollSpeed;
        }
      }, 50);
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScrollSpeed(Number(event.target.value));
  };

  return (
    <div className="song-display-container">
      <div className="song-display" ref={songDisplayRef}>
        {song.map((line, lineIndex) => {
          const isLineRTL = isRTL(line[0].lyrics);
          const rtlStyle: CSSProperties = isLineRTL
            ? { direction: "rtl", textAlign: "right" }
            : {};

          return (
            <div key={lineIndex} className="song-line" style={rtlStyle}>
              {showChords && (
                <div className="chord-line" style={rtlStyle}>
                  {line.map((part, partIndex) => (
                    <span
                      key={`chord-${lineIndex}-${partIndex}`}
                      className="chord"
                    >
                      {part.chords || "\u00A0"}
                    </span>
                  ))}
                </div>
              )}
              <div className="lyric-line" style={rtlStyle}>
                {line.map((part, partIndex) => (
                  <span
                    key={`lyric-${lineIndex}-${partIndex}`}
                    className="lyric"
                  >
                    {addSpaceBetweenWords(
                      part.lyrics,
                      line[partIndex + 1]?.lyrics
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="auto-scroll-controls">
        <button className="auto-scroll-button" onClick={toggleAutoScroll}>
          {isAutoScrolling ? "Stop" : "Play"}
        </button>
        <div className="speed-control">
          <label htmlFor="speed-slider">Speed:</label>
          <input
            type="range"
            id="speed-slider"
            min="1"
            max="10"
            value={scrollSpeed}
            onChange={handleSpeedChange}
          />
          <span>{scrollSpeed}</span>
        </div>
      </div>
    </div>
  );
};

export default SongDisplay;
