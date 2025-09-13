"use client";
import supabase from "@/utils/client";
import { useParams, useRouter, usePathname } from "next/navigation";
import NavBar from "@/components/navbar";
import { useEffect, useState } from "react";
import Greeting from "@/components/Greeting";
import { IoMdAddCircle, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { RiRefreshFill } from "react-icons/ri";
import { getUserWithExpiry } from "@/utils/storage";
import { GiSecretBook } from "react-icons/gi";
import { IoMdCloseCircle } from "react-icons/io";
import { PiShareFat } from "react-icons/pi";
import { MdCancel } from "react-icons/md";
import {
  AddDetails,
  errorDetails,
  retriveDataDetails,
  deleteFileInfo,
  fileShare,
} from "@/utils/types";
import { AnimatePresence, motion } from "framer-motion";
import { encryptLink } from "@/utils/crypto";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaFileShield } from "react-icons/fa6";
import { SiChainguard } from "react-icons/si";
import { useFileData } from "@/context/FileDataContext";
import { RiDeleteBin6Fill } from "react-icons/ri";
import TrashAnimation from "@/animations/Trash.json";
import dynamic from "next/dynamic";
import SendMessage from "@/components/SendMessage";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Page() {
  const params = useParams();
  const link = usePathname().toString();
  const id = params?.id?.toString() as string;
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [visited, setVisited] = useState(false);
  const [add, setAdd] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const { setFileData } = useFileData();
  const [fileInfo, setFileInfo] = useState<AddDetails>({
    name: "",
    pin: "",
    expiry_date: "",
    file_url: "",
  });
  const [deletefile, setDelete] = useState<deleteFileInfo>({
    operation: false,
    deleteFileName: "",
    pin: "",
    gifAlert: false,
  });
  const [shareFile, setShareFile] = useState<fileShare>({
    share: false,
    file_id: "",
    file_name: "",
    expiry_date: "",
  });
  const [retriveFiles, setRetriveFiles] = useState<Array<retriveDataDetails>>(
    []
  );
  const today = new Date().toISOString().split("T")[0];
  const [message, setMessage] = useState<errorDetails>({
    message: "",
    sucess: false,
    error: false,
  });

  useEffect(() => {
    const visitedStr = sessionStorage.getItem("visited");
    const user = getUserWithExpiry("user");

    if (user?.name) {
      setName(user.name);
    }

    const data = visitedStr ? JSON.parse(visitedStr) : null;

    if (data?.visit === false) {
      setVisited(true);
      sessionStorage.setItem("visited", JSON.stringify({ visit: true }));
      setTimeout(() => setVisited(false), 8000);
    }

    retriveData();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFileInfo((prev) => ({ ...prev, [name]: value }));
    console.log(fileInfo);
  }

  function showMessage(message: string, error: boolean = false) {
    if (error) {
      setMessage({ message: message, error: true, sucess: false });
      setTimeout(() => {
        setMessage({ message: "", error: false, sucess: false });
      }, 1000);
    } else {
      setMessage({ message: message, error: false, sucess: true });
      setTimeout(() => {
        setMessage({ message: "", error: false, sucess: false });
      }, 1000);
    }
  }

  function validate(): boolean {
    if (!fileInfo.name || fileInfo.name.trim() === "") {
      showMessage("File name is required", true);
      return false;
    }

    if (!fileInfo.expiry_date) {
      showMessage("Expiry date is required", true);
      return false;
    }

    const today = new Date();
    const expiry = new Date(fileInfo.expiry_date);

    if (expiry <= today) {
      showMessage("Expiry date must be greater than today", true);
      return false;
    }
    if (fileInfo.pin.length != 6) {
      showMessage("Pin Must be 6 digit only", true);
      return false;
    }
    if (file == null) {
      showMessage("Select the file ", true);

      return false;
    }
    return true;
  }
  async function handleSubmit() {
    if (validate()) {
      try {
        if (file) {
          const fileName = `${id}/files/${fileInfo.name.toLowerCase()}.${
            file.name.split(".")[1]
          }`;

          const { error } = await supabase.storage
            .from("file") // bucket name (make sure it's lowercase 'files')
            .upload(fileName, file, {
              upsert: false,
              cacheControl: "3600",
            });
          if (error) {
            showMessage("Upload failed: " + error.message, true);
          } else {
            console.log("File uploaded:");

            const { data: urlData } = await supabase.storage
              .from("file")
              .getPublicUrl(fileName);

            const encrypted = await encryptLink(
              urlData.publicUrl,
              fileInfo.pin
            );
            console.log(id);
            const { error: insertError } = await supabase.from("files").insert({
              user_id: id,
              pin: fileInfo.pin,
              name: fileInfo.name,
              data_link: encrypted,
              expiry_date: new Date(fileInfo.expiry_date).toISOString(),
              file_location: fileName,
            });
            if (insertError) {
              showMessage("Error Ocuur", true);
            } else {
              showMessage("File Uploaded");
            }
          }
        } else {
          showMessage("No file selected", true);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        showMessage("Unexpected error occurred", true);
      } finally {
        setFileInfo({ name: "", pin: "", expiry_date: "", file_url: "" });
        setFile(undefined);
        setAdd(false);
        retriveData();
      }
    }
  }
  async function retriveData() {
    const { data, error } = await supabase
      .from("files")
      .select("data_link,name,expiry_date,id,pin")
      .eq("user_id", id);
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setRetriveFiles(data);
    }
  }
  async function deleteFile() {
    setDelete((prev) => ({ ...prev, operation: false, gifAlert: true }));
    const { error } = await supabase
      .from("files")
      .delete()
      .eq("id", deletefile.deleteFileName)
      .single();

    if (error) {
      showMessage("Error Occuring while deleting the file", true);
      retriveData();
    } else {
      setTimeout(() => {
        setDelete((prev) => ({ ...prev, gifAlert: false }));
      }, 1300);
      retriveData();
    }
  }

  return (
    <div className="w-full min-h-screen p-0 m-0 relative bg-[#0F172A] text-white">
      {shareFile.share && (
        <div className="absolute w-full h-full bg-black/60 z-9997 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
          <MdCancel
            className=" absolute  top-2 right-2 text-2xl cursor-pointer hover:text-red-500"
            onClick={() => setShareFile((prev) => ({ ...prev, share: false }))}
          />
          <SendMessage
            message_id={shareFile.file_id}
            sender_id={id}
            message_name={shareFile.file_name}
            expiry_date={shareFile.expiry_date}
          />
        </div>
      )}
      {add && (
        <div className=" absolute w-full h-full bg-black/60 z-9999 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
          <div
            className=" text-white
    md:px-3 md:py-3 p-2 bg-[#1E293B]/90 backdrop-blur-md shadow-2xl rounded-2xl z-101 flex flex-col gap-4 md:w-80 w-70"
          >
            {/* Close Button */}
            <button
              onClick={() => setAdd(false)}
              className="absolute top-3 right-3 p-1 bg-gradient-to-r from-red-500 to-pink-500 
       rounded-full shadow-md cursor-pointer"
            >
              <IoMdCloseCircle className="text-sm text-white" />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold text-white text-center">
              Add new File to secure
            </h2>

            {/* Name Input */}
            <div
              className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] 
      focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl"
            >
              <input
                type="text"
                placeholder="Enter file name"
                className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
                name="name"
                value={fileInfo.name}
                onChange={handleChange}
              />
            </div>

            {/* PIN with toggle */}
            <div
              className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] 
      focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl"
            >
              <input
                type={showPin ? "text" : "password"}
                placeholder="Enter PIN"
                className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
                name="pin"
                value={fileInfo.pin}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-gray-400 hover:text-white"
              >
                {showPin ? (
                  <IoMdEyeOff className="cursor-pointer" />
                ) : (
                  <IoMdEye className="cursor-pointer" />
                )}
              </button>
            </div>

            {/* Expiry Date */}
            <div className="flex gap-1 flex-col">
              {" "}
              <div
                className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] 
      focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl"
              >
                <input
                  type="date"
                  className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
                  placeholder="expiray date"
                  name="expiry_date"
                  value={fileInfo.expiry_date}
                  onChange={handleChange}
                  min={today}
                />
              </div>
              <p className="text-xs text-gray-400 ms-2">Expiray Date</p>
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1a2237] 
        focus-within:ring-2 focus-within:ring-blue-500 transition p-3 rounded-xl"
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="bg-transparent outline-none flex-1 text-sm 
          file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 
          file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                  onChange={(e) => {
                    const data = e?.target?.files?.[0];
                    setFile(data ?? undefined);
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                Upload file should be in the format of .pdf, .doc or .docx
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <button
                className="mt-2 w-max px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 
       text-white rounded-lg shadow-md hover:scale-[1.02] 
       transition-all duration-300 cursor-pointer"
                onClick={handleSubmit}
              >
                Secure the file
              </button>
            </div>
          </div>
        </div>
      )}
      <NavBar />

      <AnimatePresence>
        {(message.error || message.sucess) && (
          <motion.div
            key="message"
            className={`${
              message.error ? "bg-red-600" : "bg-green-500"
            } text-white text-sm font-medium rounded-xl shadow-xl px-4 py-2 absolute left-1/2 top-10 -translate-1/2 z-1011`}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4 }}
          >
            {message.message}
          </motion.div>
        )}
      </AnimatePresence>

      {(visited || deletefile.operation || deletefile.gifAlert) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full min-h-screen z-9999 bg-black/30 flex justify-center items-center">
          {visited ? (
            <Greeting />
          ) : (
            <div className="md:w-70 w-70 h-max bg-[#0F172A] shadow-2xl flex flex-col justify-between items-center rounded-2xl p-6 text-white">
              {deletefile.operation ? (
                <>
                  {" "}
                  <p className="text-lg font-semibold text-center">
                    Are you sure you want to delete this file?
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button
                      className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition cursor-pointer"
                      onClick={() =>
                        setDelete({
                          operation: false,
                          deleteFileName: "",
                          pin: "",
                          gifAlert: false,
                        })
                      }
                    >
                      No
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition cursor-pointer"
                      onClick={deleteFile}
                    >
                      Yes, I’m sure
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Lottie
                    animationData={TrashAnimation}
                    loop={true}
                    className="w-40 h-40"
                  />
                  <h2 className="text-xl font-semibold text-green-600 text-center">
                    File Deleted Successfully
                  </h2>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="w-full p-3 flex gap-4 items-center">
        <p className="font-medium">{name}</p>

        <div className="flex items-center gap-2">
          <span className="text-sm">Active</span>
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 md:p-1.5  p-[1px] rounded-2xl group flex justify-center items-center gap-2 ease-in-out cursor-pointer">
          <GiSecretBook className="md:text-xl text-md" />
          <p className="md:opacity-0 scale-0 md:group-hover:opacity-100 md:group-hover:scale-100 transition-all duration-300">
            {retriveFiles.length}
          </p>
        </div>

        <button
          className="md:p-2 p-1 cursor-pointer bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl group transition"
          onClick={() => setAdd(true)}
        >
          <IoMdAddCircle className="md:text-xl text-md group-hover:animate-bounce" />
        </button>

        <button
          className="md:p-2 p-1 cursor-pointer bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl group transition"
          onClick={retriveData}
        >
          <RiRefreshFill className="md:text-xl text-md group-hover:animate-spin" />
        </button>
      </div>
      <div className="w-full overflow-auto md:h-160 h-130 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 place-items-center justify-center p-2 md:mt-10">
          {retriveFiles.map((value) => {
            return (
              <div
                className="h-48 w-64 rounded-2xl bg-gradient-to-b from-slate-700 to-slate-900 p-5 flex flex-col items-center justify-between shadow-lg hover:scale-105 transition-transform duration-300 relative z-10"
                key={value.id}
              >
                <div className="text-center">
                  <p className="text-white font-semibold text-lg mb-2">
                    {value.name}
                  </p>
                  <div className="flex justify-center items-center gap-3">
                    <MdAccessTimeFilled className="" />
                    <p className="text-gray-300 text-sm">
                      Expires in:{" "}
                      {Math.max(
                        0,
                        Math.ceil(
                          (new Date(value.expiry_date).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}{" "}
                      days
                    </p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 items-center">
                  <RiDeleteBin6Fill
                    className="text-red-300 text-2xl cursor-pointer "
                    onClick={() =>
                      setDelete({
                        operation: true,
                        deleteFileName: value.id,
                        pin: value.id,
                        gifAlert: false,
                      })
                    }
                  />

                  <PiShareFat
                    className="text-2xl cursor-pointer hover:text-sky-600"
                    onClick={() =>
                      setShareFile({
                        file_id: value.id,
                        file_name: value.name,
                        share: true,
                        expiry_date: value.expiry_date,
                      })
                    }
                  />
                </div>
                <div
                  className="flex justify-center items-center mt-3 bg-indigo-600 text-white font-medium py-2 px-5 rounded-lg hover:bg-indigo-500 transition-colors gap-2 group cursor-pointer"
                  onClick={() => {
                    setFileData({
                      name: value.name,
                      expiry_date: value.expiry_date,
                      pin: value.pin,
                      data_link: value.data_link,
                      id: value.id,
                    });
                    const newlink = link + "/file";
                    router.push(newlink);
                  }}
                >
                  <p>Open</p>
                  <SiChainguard className="group-hover:text-2xl transition-all ease-in-out " />
                </div>

                <div className=" absolute -right-1  bg-emerald-600 p-2 rounded-3xl -top-2">
                  <FaFileShield />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
