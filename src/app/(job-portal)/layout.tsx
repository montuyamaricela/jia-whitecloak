import "@/lib/styles/commonV2/globals.scss";
import ContextV2 from "@/lib/context/ContextV2";

export const metadata = {
  alternates: { canonical: "https://jia-whitecloak-production.up.railway.app" },
  description: "JIA Job Portal",
  title: "JIA Job Portal",
};

export default function ({ children }) {
  return <ContextV2>{children}</ContextV2>;
}
