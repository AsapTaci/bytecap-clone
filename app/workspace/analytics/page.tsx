import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import ComingSoon from "@/components/sites/bytecap/ComingSoon";

export const instant = false;

export default function AnalyticsPage() {
  return (
    <DashboardChrome breadcrumb="Analytics" backHref="/workspace">
      <ComingSoon
        title="Analytics"
        description="Statistiche reali su views, engagement e crescita una volta collegati i canali social. In arrivo."
      />
    </DashboardChrome>
  );
}
