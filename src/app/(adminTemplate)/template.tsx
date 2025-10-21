import AdminLayout from "@/components/layouts/AdminLayout";
import { ReactNode } from "react";

type AdminTemplateProps = {
  children: ReactNode;
};

export default function AdminTemplate({ children }: AdminTemplateProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
