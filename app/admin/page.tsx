/**
 * /admin 默认重定向到 /admin/share
 */
import { redirect } from "next/navigation";

export default function AdminIndex() {
  redirect("/admin/share");
}