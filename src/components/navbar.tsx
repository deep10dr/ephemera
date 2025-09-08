import Image from "next/image";
import { getUserWithExpiry } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosNotifications } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
export default function NavBar() {
  const [name, setName] = useState<string | undefined>("");
  const [show, setShow] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const data: string | undefined = getUserWithExpiry("user")?.name;
    setName(data);
  }, []);
  return (
    <header className="flex justify-between items-center w-full px-6 py-4 shadow-md relative">
      <h1 className="md:text-4xl text-3xl font-extrabold text-white tracking-wide">
        Ephemera
      </h1>
      {show && (
        <div className=" absolute w-40 h-50 bg-white/80 md:right-29 right-25 top-9  text-[#1E293B]/90 z-9999 rounded-b-3xl rounded-l-3xl flex justify-center ">
          <div className="flex justify-center items-center w-max h-max gap-4 mt-1">
            <h2 className="font-bold">Notification</h2>
            <IoMdSettings className="w-4 h-4 " />
          </div>
        </div>
      )}

      <div className="relative md:w-25 w-20  h-10 rounded-full overflow-hidden bg-[#1E293B] flex justify-center items-center md:gap-8 gap-5">
        <IoIosNotifications
          className="h-5 w-5 hover:animate-shake cursor-pointer"
          onClick={() => setShow((prev) => !prev)}
        />
        <Image
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            name ? name : "unkown"
          )}&background=0D8ABC&color=fff&format=png`}
          width={30}
          height={30}
          alt="avatar"
          quality={100}
          unoptimized
          className="border-2 border-white shadow-md hover:scale-102 transition-transform duration-300 cursor-pointer rounded-2xl "
          onClick={() => {
            router.push("/user");
          }}
        />
      </div>
    </header>
  );
}
