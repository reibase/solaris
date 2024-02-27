export function getDurationSince(timestampString) {
  const cleanTimestampString = timestampString.replace(/\s/g, "");
  if (!Date.parse(cleanTimestampString)) {
    return "Invalid date format";
  }
  const createdAt = new Date(cleanTimestampString);
  const now = new Date();
  const diffInMs = now - createdAt;
  const diffInSeconds = Math.round(diffInMs / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} S`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes} MIN`;
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours} HR`;
  } else {
    const diffInDays = Math.floor(diffInSeconds / 86400);
    return `${diffInDays} D`;
  }
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
