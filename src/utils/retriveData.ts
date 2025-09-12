import supabase from "./client";
import { retriveNotificationInterface } from "./types";

const retriveNotification = async (
  user_id: string
): Promise<retriveNotificationInterface> => {
  try {
    const { data } = await supabase
      .from("notifications")
      .select("body_id,sender_id,created_at")
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

export function TimeFormat(data: string): string {
  const date = new Date(data);
  return date.toLocaleTimeString([], { minute: "2-digit", hour: "2-digit" });
}
export function DateFormat(data: string): string
{
  const date = new Date(data);
  return date.toLocaleDateString([],{day:"2-digit",month:"2-digit",year:"2-digit"});
}
