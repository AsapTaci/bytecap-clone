import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import ComingSoon from "@/components/sites/bytecap/ComingSoon";

export const instant = false;

export default function AutomationsPage() {
  return (
    <DashboardChrome breadcrumb="Automations" backHref="/workspace">
      <ComingSoon
        title="Automations"
        description="Regole automatiche per clippare, sottotitolare e pubblicare senza intervento manuale. In arrivo."
      />
    </DashboardChrome>
  );
}
