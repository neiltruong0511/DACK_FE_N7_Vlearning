import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Logo */}
        <div>
          <h2 className="text-3xl font-bold text-blue-400">VLearning</h2>

          <p className="mt-4 text-gray-400 leading-7">
            Nền tảng học lập trình trực tuyến với hàng trăm khóa học chất lượng
            dành cho sinh viên và lập trình viên.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">Liên kết</h3>

          <div className="space-y-3">
            <Link href="/" className="block hover:text-blue-400">
              Trang chủ
            </Link>

            <Link href="/courses" className="block hover:text-blue-400">
              Khóa học
            </Link>

            <Link href="/search" className="block hover:text-blue-400">
              Tìm kiếm
            </Link>

            <Link href="/profile" className="block hover:text-blue-400">
              Hồ sơ
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">Liên hệ</h3>

          <p className="text-gray-400">📧 support@vlearning.com</p>

          <p className="mt-2 text-gray-400">☎ 0123 456 789</p>

          <p className="mt-2 text-gray-400">📍 Hồ Chí Minh, Việt Nam</p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-sm text-gray-500">
        © 2026 VLearning. All rights reserved.
      </div>
    </footer>
  );
}
