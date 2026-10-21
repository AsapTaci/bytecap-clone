import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import ComingSoon from "@/components/sites/bytecap/ComingSoon";

export const instant = false;

export default function SocialAccountsPage() {
  return (
    <DashboardChrome breadcrumb="Social accounts" backHref="/workspace">
      <ComingSoon
        title="Social accounts"
        description="Collega TikTok, YouTube, Instagram e altri canali per pubblicare direttamente. In arrivo."
      />
    </DashboardChrome>
  );
}
