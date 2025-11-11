import Sidebar from "@/lib/components/common/Sidebar";

export const metadata = {
  alternates: {
    canonical: "https://jia-whitecloak-production.up.railway.app/whitecloak/applicant",
  },
  description: "Dashboard - Whitecloak Careers",
  title: "Dashboard - Whitecloak Careers",
};

export default function ({ children }) {
  return <Sidebar>{children}</Sidebar>;
}
