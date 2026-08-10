const FAVORITE_KEY = "FAVORITE_COURSES";

export function getFavoriteCourses(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(FAVORITE_KEY);

    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavoriteCourse(maKhoaHoc: string) {
  const favorites = getFavoriteCourses();

  if (!favorites.includes(maKhoaHoc)) {
    favorites.push(maKhoaHoc);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
  }
}

export function removeFavoriteCourse(maKhoaHoc: string) {
  const favorites = getFavoriteCourses();

  const updated = favorites.filter(
    (id) => id !== maKhoaHoc
  );

  localStorage.setItem(
    FAVORITE_KEY,
    JSON.stringify(updated)
  );
}

export function isFavoriteCourse(maKhoaHoc: string) {
  return getFavoriteCourses().includes(maKhoaHoc);
}