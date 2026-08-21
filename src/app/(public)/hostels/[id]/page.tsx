import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HostelsRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/hostel/${id}`);
}
