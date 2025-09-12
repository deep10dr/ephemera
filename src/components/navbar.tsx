import Image from "next/image";
import { getUserWithExpiry } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosNotifications } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { MdAccessTimeFilled } from "react-icons/md";
import { MdCallReceived } from "react-icons/md";
import { useFileData } from "@/context/FileDataContext";
import {
  retriveNotification,
  retriveUserName,
  TimeFormat,
  DateFormat,
} from "@/utils/retriveData";
import { retriveNotificationInterface } from "@/utils/types";
import emprt_box_animation from "@/animations/empty_box_blue.json";
import dynamic from "next/dynamic";
import supabase from "@/utils/client";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
interface userDetails {
  name: string;
  user_id: string;
}

export default function NavBar() {
  const [name, setName] = useState<userDetails | null>(null);
  const [show, setShow] = useState(false);
  const [notifData, setNotifData] =
    useState<retriveNotificationInterface | null>();
  const router = useRouter();
  const { setFileData } = useFileData();
  const date = new Date();
  const [username, setUserName] = useState([""]);
  useEffect(() => {
    const user = getUserWithExpiry("user");
    if (user) {
      setName({ name: user.name, user_id: user.id });
    }
  }, []);

  useEffect(() => {
    if (!name || !show) return;

    async function fetchNotifications() {
      if (name)
        try {
          const response = await retriveNotification(name.user_id);
          setNotifData(response);

          if (response?.data) {
            const senderNames = await Promise.all(
              response.data.map((value) => retriveUserName(value.sender_id))
            );
            setUserName(senderNames);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
    }

    fetchNotifications();
  }, [name, show]);

  return (
    <header className="flex justify-between items-center w-full px-6 py-4 shadow-md relative">
      <h1 className="md:text-4xl text-3xl font-extrabold text-white tracking-wide">
        Ephemera
      </h1>
      {show && (
        <div
          className="absolute animate-shake  md:w-60 w-56 max-h-[400px] bg-white/90 backdrop-blur-md shadow-xl border border-slate-200 md:right-28 right-22 top-12 
                text-slate-800 z-[9999] rounded-2xl flex flex-col gap-3 p-4"
        >
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h2 className="font-semibold text-slate-700">Notifications</h2>
            <IoMdSettings className="w-5 h-5 cursor-pointer hover:text-slate-600 transition" />
          </div>
          <div className="flex gap-2 overflow-y-auto h-max flex-col-reverse pb-1">
            {/* Case 1: No data fetched yet (loading) */}
            {!notifData ? (
              <div className="flex justify-center items-center h-full">
                <Lottie animationData={emprt_box_animation} className="h-30" />
              </div>
            ) : notifData.error?.error ? (
              // Case 2: API returned an error
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-red-500">
                  Failed to load notifications
                </p>
              </div>
            ) : notifData.data && notifData.data.length > 0 ? (
              // Case 3: There is notification data
              <>
                {notifData.data.map((value, index) => (
                  <div
                    key={index}
                    className="w-full bg-white shadow-md rounded-xl p-1.5 cursor-pointer border border-slate-200 hover:bg-slate-200  focus:scale-101 transition-all duration-200 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">
                        {username[index]}
                      </p>
                      <MdCallReceived className="text-green-500 text-lg" />
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MdAccessTimeFilled className="text-slate-400" />
                        {TimeFormat(value?.created_at)}
                      </span>
                      <span>{DateFormat(value?.created_at)}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Case 4: No notifications found
              <div className="flex justify-center items-center h-full flex-col">
                <Lottie animationData={emprt_box_animation} className="h-20" />
                <p className="text-sm text-gray-500">
                  No notifications available
                </p>
              </div>
            )}
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
