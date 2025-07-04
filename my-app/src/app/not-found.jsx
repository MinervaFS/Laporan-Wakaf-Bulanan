export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="text-xl mt-4 text-gray-300">
          Oops! Halaman tidak ditemukan.
        </p>
        {/* <a
          href="/"
          className="mt-6 inline-block bg-white text-black px-6 py-2 rounded hover:bg-gray-300 transition"
        >
          Kembali ke Beranda
        </a> */}
      </div>
    </div>
  );
}
