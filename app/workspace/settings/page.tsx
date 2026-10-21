import { Suspense } from "react";
import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import SettingsPanel from "@/components/sites/bytecap/SettingsPanel";

export const instant = false;

export default function SettingsPage() {
  return (
    <DashboardChrome breadcrumb="Settings" backHref="/workspace">
      <Suspense fallback={null}>
        <SettingsPanel />
      </Suspense>
    </DashboardChrome>
  );
}
