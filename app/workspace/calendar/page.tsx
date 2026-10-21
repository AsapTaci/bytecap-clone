import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import ComingSoon from "@/components/sites/bytecap/ComingSoon";

export const instant = false;

export default function CalendarPage() {
  return (
    <DashboardChrome breadcrumb="Calendar" backHref="/workspace">
      <ComingSoon
        title="Calendar"
        description="Pianifica e pubblica le tue clip su tutti i canali social da un unico calendario. In arrivo."
      />
    </DashboardChrome>
  );
}
