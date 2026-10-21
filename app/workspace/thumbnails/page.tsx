import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import ComingSoon from "@/components/sites/bytecap/ComingSoon";

export const instant = false;

export default function ThumbnailsPage() {
  return (
    <DashboardChrome breadcrumb="Thumbnails" backHref="/workspace">
      <ComingSoon
        title="Thumbnails"
        description="Genera copertine AI ad alto impatto per Shorts, Reels e YouTube. In arrivo."
      />
    </DashboardChrome>
  );
}
