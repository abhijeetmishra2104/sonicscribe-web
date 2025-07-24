import AnalysisDisplay from "../../../components/analysis-display";

export const dynamic = "force-dynamic";

// New type for Next.js 15+
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PDFPreview({ searchParams }: PageProps) {
  const searchParamsObj = await searchParams;
  const encoded = searchParamsObj?.analysis?.toString() || "";
  const analysis = decodeURIComponent(encoded);

  return (
    <div className="p-10 bg-black text-white min-h-screen">
      <AnalysisDisplay analysis={analysis} />
    </div>
  );
}
