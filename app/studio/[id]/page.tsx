import DashboardChrome from "@/components/sites/bytecap/DashboardChrome";
import StudioClient from "@/components/sites/bytecap/StudioClient";

// This page looks up live job status per request and can't be prerendered.
export const instant = false;

export default async function StudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardChrome breadcrumb="Your Clips" backHref="/workspace">
      <StudioClient jobId={id} />
    </DashboardChrome>
  );
}
