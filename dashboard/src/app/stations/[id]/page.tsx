import StationDetailsSection from "@/components/sections/station";

export default async function StationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <StationDetailsSection id={parseInt(id)} />
  );
}
