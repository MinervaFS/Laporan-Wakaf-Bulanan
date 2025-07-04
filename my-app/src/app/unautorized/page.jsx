export default function Unauthorized() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Akses Ditolak</h1>
      <p className="text-lg text-gray-600">
        Hanya admin yang bisa mengakses situs ini.
      </p>
    </div>
  );
}
