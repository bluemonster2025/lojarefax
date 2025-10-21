import { ReactNode } from "react";
import EcommerceLayout from "@/components/layouts/EcommerceLayout";

type RootTemplateProps = {
  children: ReactNode;
};

export default function RootTemplate({ children }: RootTemplateProps) {
  return <EcommerceLayout>{children}</EcommerceLayout>;
}
