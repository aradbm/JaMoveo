export type Song = {
  title: string;
  artist: string;
  content: Array<Array<{ lyrics: string; chords?: string }>>;
  // the content field is an array of arrays of objects, each array in the outer array is
  // a line in the song, each object in the inner array is a word in the line, above each word
  // there might be a chord to be displayed
};
