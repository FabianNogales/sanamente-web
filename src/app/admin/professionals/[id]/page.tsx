import { AdminProfessionalDetailView } from "@/components/admin/AdminProfessionalDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminProfessionalDetailPage({ params }: Props) {
  const { id } = await params;
  return <AdminProfessionalDetailView professionalId={id} />;
}
