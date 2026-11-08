const tileColors = [
  "#d9ad38",
  "#4a9b9c",
  "#d46f52",
  "#7e9862",
  "#8b78aa",
  "#e28a3e",
];

export const tileColor = (project, index) =>
  project.tileAccent ?? tileColors[index % tileColors.length];

// Picks black or white text by the tile colour's relative luminance.
export function tileTextColor(color) {
  const hex = color.replace("#", "");
  const channels = [0, 2, 4].map(
    (offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255,
  );
  const luminance = channels
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (total, channel, index) =>
        total + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );

  return luminance > 0.42 ? "#101312" : "#fffdf3";
}

export function projectMark(project) {
  const words = project.title.trim().split(/\s+/);
  return words.length > 1
    ? words
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
}
