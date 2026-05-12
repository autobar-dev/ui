import UserDetailsSection from "@/components/sections/user_detail";

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <UserDetailsSection id={id} />
  );
}
