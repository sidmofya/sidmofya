export type PatternVideo = { title: string; id: string };

// To add a new short: prepend { title, id } below (newest first).
// id = the YouTube video ID — the part after /shorts/ or /watch?v=
// e.g. https://www.youtube.com/shorts/abc123XYZ → id: "abc123XYZ"
export const videos: PatternVideo[] = [];
