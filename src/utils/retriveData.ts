import supabase from "./client";
import { retriveNotificationInterface } from "./types";

const retriveNotification = async (
  user_id: string
): Promise<retriveNotificationInterface> => {
  try {
    const { data } = await supabase
      .from("notifications")
      .select("body_id,sender_id")
      .eq("receiver_id", user_id);
    if (data) {
      return { error: null, data: data };
    }

    return { error: { error: true, message: "No data found" }, data: null };
  } catch (error) {
    return { error: { error: true, message: "Error was occur" }, data: null };
  }
};

export async function retriveUserName(user_id: string): Promise<string> {
  const { data, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user_id);
  if (data) {
    return data[0]?.name;
  }

  return "unkown";
}

export { retriveNotification };
