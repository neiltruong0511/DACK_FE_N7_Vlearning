const FAVORITE_PREFIX = "FAVORITE_COURSES_";

/**
 * Lấy tài khoản đang đăng nhập
 */
function getCurrentAccount(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const userInfo = localStorage.getItem("USER_INFO");

    if (!userInfo) {
      return null;
    }

    const user = JSON.parse(userInfo);

    return user?.taiKhoan || null;
  } catch (error) {
    console.error("Lỗi đọc USER_INFO:", error);
    return null;
  }
}

/**
 * Tạo key yêu thích riêng cho từng tài khoản
 *
 * Ví dụ:
 * FAVORITE_COURSES_nguyen123
 * FAVORITE_COURSES_admin
 */
function getFavoriteKey(): string | null {
  const taiKhoan = getCurrentAccount();

  if (!taiKhoan) {
    return null;
  }

  return `${FAVORITE_PREFIX}${taiKhoan}`;
}

/**
 * Lấy danh sách khóa học yêu thích
 */
export function getFavoriteCourses(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const key = getFavoriteKey();

  // Chưa đăng nhập
  if (!key) {
    return [];
  }

  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Lỗi lấy danh sách khóa học yêu thích:",
      error,
    );

    return [];
  }
}

/**
 * Thêm khóa học yêu thích
 */
export function addFavoriteCourse(
  maKhoaHoc: string,
) {
  if (!maKhoaHoc) {
    return;
  }

  const key = getFavoriteKey();

  // Chưa đăng nhập thì không cho lưu
  if (!key) {
    return;
  }

  const favorites = getFavoriteCourses();

  if (!favorites.includes(maKhoaHoc)) {
    const updated = [
      ...favorites,
      maKhoaHoc,
    ];

    localStorage.setItem(
      key,
      JSON.stringify(updated),
    );
  }
}

/**
 * Xóa khóa học yêu thích
 */
export function removeFavoriteCourse(
  maKhoaHoc: string,
) {
  const key = getFavoriteKey();

  if (!key) {
    return;
  }

  const favorites = getFavoriteCourses();

  const updated = favorites.filter(
    (id) => id !== maKhoaHoc,
  );

  localStorage.setItem(
    key,
    JSON.stringify(updated),
  );
}

/**
 * Kiểm tra khóa học có được yêu thích không
 */
export function isFavoriteCourse(
  maKhoaHoc: string,
) {
  const favorites = getFavoriteCourses();

  return favorites.includes(maKhoaHoc);
}

/**
 * Toggle yêu thích
 *
 * return:
 * true  = đã thêm
 * false = đã xóa
 */
export function toggleFavoriteCourse(
  maKhoaHoc: string,
): boolean {
  if (isFavoriteCourse(maKhoaHoc)) {
    removeFavoriteCourse(maKhoaHoc);
    return false;
  }

  addFavoriteCourse(maKhoaHoc);
  return true;
}