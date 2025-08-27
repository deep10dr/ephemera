import Image from "next/image";

export default function NavBar() {
  return (
    <header className="flex justify-between items-center w-full px-6 py-4 shadow-md ">
      {/* Logo / Title */}
      <h1 className="md:text-4xl text-3xl font-extrabold text-white tracking-wide">
        Ephemera
      </h1>

      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer">
        <Image
          src="https://cdn-icons-png.flaticon.com/128/1999/1999625.png"
          fill
          alt="avatar"
          quality={100}
        />
      </div>
    </header>
  );
}
