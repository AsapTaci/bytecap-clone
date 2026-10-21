import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import ComingSoon from "@/components/sites/bytecap/ComingSoon";

export const instant = false;

export default function AssetsPage() {
  return (
    <DashboardChrome breadcrumb="Assets" backHref="/workspace">
      <ComingSoon
        title="Assets"
        description="La tua libreria di loghi, font, colori di brand e media caricati. In arrivo."
      />
    </DashboardChrome>
  );
}
