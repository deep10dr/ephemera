import Image from "next/image";
import { getUserWithExpiry } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosNotifications } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { retriveNotification, retriveUserName } from "@/utils/retriveData";
import { retriveNotificationInterface } from "@/utils/types";
interface userDetails {
  name: string;
  user_id: string;
}
export default function NavBar() {
  const [name, setName] = useState<userDetails | null>(null);
  const [show, setShow] = useState(false);
  const [notifData, setNotifData] = useState<retriveNotificationInterface>();
  const router = useRouter();
  useEffect(() => {
    const user = getUserWithExpiry("user");
    if (user) {
      setName({ name: user.name, user_id: user.id });
    }
  }, []);

  useEffect(() => {
    if (name) {
      async function Notify(name: userDetails) {
        const responce = await retriveNotification(name?.user_id);
        setNotifData(responce);
      }
      Notify(name);
    }
  }, [name, notifData, show]);

  return (
    <header className="flex justify-between items-center w-full px-6 py-4 shadow-md relative">
      <h1 className="md:text-4xl text-3xl font-extrabold text-white tracking-wide">
        Ephemera
      </h1>
      {show && (
        <div
          className="absolute animate-shake  md:w-60 w-55 max-h-[400px] bg-white/90 backdrop-blur-md shadow-xl border border-slate-200 md:right-28 right-22 top-12 
                text-slate-800 z-[9999] rounded-2xl flex flex-col gap-3 p-4"
        >
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h2 className="font-semibold text-slate-700">Notifications</h2>
            <IoMdSettings className="w-5 h-5 cursor-pointer hover:text-slate-600 transition" />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-60">
            {notifData == undefined ? (
              <div>Empty</div>
            ) : notifData.error?.error ? (
              <div>Error</div>
            ) : (
              <>
                {notifData.data?.map((value, index) => {
                  return (
                    <div
                      className="w-full h-12 bg-slate-100 rounded-xl animate-pulse"
                      key={index}
                    ></div>
                  );
                })}
              </>
            )}
          </div>

          <p className="cursor-pointer text-sm text-blue-600 font-medium text-center hover:underline mt-2">
            Show all
          </p>
        </div>
      )}

      <div className="relative md:w-25 w-20  h-10 rounded-full overflow-hidden bg-[#1E293B] flex justify-center items-center md:gap-8 gap-5">
        <IoIosNotifications
          className="h-5 w-5 hover:animate-shake cursor-pointer"
          onClick={() => setShow((prev) => !prev)}
        />
        <Image
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            name ? name.name : "unkown"
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
