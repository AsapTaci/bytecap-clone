import { Suspense } from "react";
import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import WorkspaceHome from "@/components/sites/bytecap/WorkspaceHome";

export const instant = false;

export default function WorkspacePage() {
  return (
    <DashboardChrome>
      <Suspense fallback={null}>
        <WorkspaceHome />
      </Suspense>
    </DashboardChrome>
  );
}
