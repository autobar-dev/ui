import ModuleDetailsSection from "@/components/sections/module_detail";

export default async function ModulePage({ params }: { params: Promise<{ serialNumber: string }> }) {
  const { serialNumber } = await params;
  return (
    <ModuleDetailsSection serialNumber={serialNumber} />
  );
}
