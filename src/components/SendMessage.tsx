"use client";
import supabase from "@/utils/client";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import message_send from "@/animations/message_send.json";

interface MessageInfo {
  message_id: string;
  sender_id: string;
  message_name: string;
  expiry_date: string;
}
interface ReceiverInfo {
  name: string;
  id: string;
  phone: string;
  confirm: boolean;
}

export default function SendMessage({
  message_id,
  sender_id,
  message_name,
  expiry_date,
}: MessageInfo) {
  const [searchNumber, setSearchNumber] = useState("");
  const [receiver, setReceiverData] = useState<ReceiverInfo | null>(null);
  const [send, setSend] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setSearchNumber(value);
      if (value.length === 10) {
        retrieveReceiverData(value);
      } else {
        setReceiverData(null);
      }
    }
  };

  async function retrieveReceiverData(value: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("phone", value);

    if (error) {
      console.error(error.message);
      setReceiverData(null);
    } else {
      const v = data.length > 0 ? data[0] : null;
      if (v == null) {
        setReceiverData(null);
      } else {
        setReceiverData({
          phone: v.phone,
          name: v.name,
          id: v.id,
          confirm: false,
        });
      }
    }
  }
  async function handleSubmit() {
    if (sender_id != receiver?.id) {
      const { error } = await supabase.from("notifications").insert({
        sender_id: sender_id,
        receiver_id: receiver?.id,
        body_id: message_id,
        expiry_date: expiry_date,
      });
      if (error) {
        console.log(error);
      } else {
        setSend(true);
        setTimeout(() => setSend(false), 7500);
        setReceiverData(null);
        setSearchNumber("");
      }
    } else {
      console.log("same id");
    }
  }

  return (
    <div className="md:w-90 h-70 w-70 shadow-2xl rounded-2xl text-center bg-[#1E293B]/90">
      {send ? (
        <div className="w-full h-full flex justify-center items-center ">
          <Lottie animationData={message_send} loop />
        </div>
      ) : (
        <>
          <p className="text-lg font-semibold text-white mt-4">
            Send the file <span className="text-blue-400">{message_name}</span>
          </p>
          <p className="text-sm text-gray-300 mb-4">
            Enter the user phone number in ephemera
          </p>

          <div className="px-6 flex justify-center items-center flex-col group text-black h-max ">
            <div
              className={`flex w-full justify-center items-center gap-2 px-4 bg-white 
                    transition-all ${
                      receiver && !receiver.confirm
                        ? "rounded-b-none rounded-t-2xl"
                        : "rounded-2xl"
                    } `}
            >
              <input
                type="text"
                value={searchNumber}
                onChange={handleChange}
                placeholder="Enter user mobile number"
                className="w-full max-w-xs px-3 py-2 bg-transparent text-black
                 border-none outline-none placeholder-gray-500"
              />
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition"
                onClick={() => retrieveReceiverData(searchNumber)}
              >
                <FiSearch className="text-lg text-gray-700" />
              </button>
            </div>

            <div
              className={`${
                receiver && !receiver.confirm ? "flex h-max" : "hidden"
              } w-full flex-col bg-white 
                       rounded-b-2xl shadow-md animate-fadeIn ease-out p-2 h-max`}
            >
              {receiver && !receiver.confirm && (
                <div
                  className="p-2 focus:bg-sky-300 hover:bg-sky-400 bg-blue-300 rounded-2xl flex items-center gap-8 cursor-pointer"
                  onClick={() => {
                    setReceiverData((prev) =>
                      prev
                        ? {
                            ...prev,
                            confirm: true,
                          }
                        : prev
                    );
                  }}
                >
                  <FaUser className="ms-5" />

                  <div className="flex justify-center items-center font-semibold flex-col border-l-2 px-3">
                    <p>{receiver.name}</p>
                    <div className="flex gap-2 text-xs justify-center items-center">
                      <FaPhoneAlt />
                      <p>{receiver.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {receiver?.confirm && (
            <p className="mt-4 text-white">
              Receiver confirmed:{" "}
              <span className="text-blue-400">{receiver.name}</span>
            </p>
          )}
          <div className="w-full h-16 mt-7 justify-between flex flex-col items-center">
            <div className="flex md:gap-2 px-1 flex-row justify-items-start ">
              <input
                type="checkbox"
                name="agreement"
                id="agreement"
                disabled={!receiver?.confirm}
              />
              <p className="text-xs">
                Do you consent to share your private file with{" "}
                <span className="font-medium">{receiver?.name}</span>?
              </p>
            </div>
            <button
              className="py-2 px-3 cursor-pointer bg-sky-400 rounded-xl font-semibold w-max mt-2 md:mt-5"
              disabled={!receiver?.confirm}
              onClick={handleSubmit}
            >
              Send File
            </button>
          </div>
        </>
      )}
    </div>
  );
}
