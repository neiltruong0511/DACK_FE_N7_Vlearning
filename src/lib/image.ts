const IMAGE_BASE_URL =
  "https://elearningnew.cybersoft.edu.vn/hinhanh";

export const getImageUrl = (image?: string | null) => {
  if (!image) {
    return "https://placehold.co/600x400?text=No+Image";
  }

  const value = image.trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${IMAGE_BASE_URL}/${value.replace(/^\/+/, "")}`;
};