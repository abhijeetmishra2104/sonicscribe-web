// app/pdf/preview/page.tsx

import AnalysisDisplay from "../../../components/analysis-display";

export const dynamic = "force-dynamic"; // Always generate fresh version

export default function PDFPreview({ searchParams }: { searchParams: { analysis: string } }) {
  const analysis = decodeURIComponent(searchParams.analysis || "");

  return (
    <div className="p-10 bg-black text-white min-h-screen">
      <AnalysisDisplay analysis={analysis} />
    </div>
  );
}
