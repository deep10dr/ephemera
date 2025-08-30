import Image from "next/image";
import { getUserWithExpiry } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function NavBar() {
  const [name, setName] = useState<string | undefined>("");
  const router = useRouter();
  useEffect(() => {
    const data: string | undefined = getUserWithExpiry("user")?.name;
    setName(data);
  }, []);
  return (
    <header className="flex justify-between items-center w-full px-6 py-4 shadow-md ">
      <h1 className="md:text-4xl text-3xl font-extrabold text-white tracking-wide">
        Ephemera
      </h1>

      <div
        className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer"
        onClick={() => {
          router.push("/user");
        }}
      >
        <Image
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            name ? name : "unkown"
          )}&background=0D8ABC&color=fff&format=png`}
          fill
          alt="avatar"
          quality={100}
          unoptimized
        />
      </div>
    </header>
  );
}
