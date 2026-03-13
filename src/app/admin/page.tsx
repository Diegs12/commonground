import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) redirect("/");

  const [totalStories, published, pending, rejected, totalUsers, totalArticles] =
    await Promise.all([
      prisma.story.count(),
      prisma.story.count({ where: { status: "PUBLISHED" } }),
      prisma.story.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.story.count({ where: { status: "REJECTED" } }),
      prisma.user.count(),
      prisma.sourceArticle.count(),
    ]);

  const stats = [
    { label: "Published", value: published, color: "text-emerald-600" },
    { label: "Pending Review", value: pending, color: "text-yellow-600" },
    { label: "Rejected", value: rejected, color: "text-red-600" },
    { label: "Total Stories", value: totalStories, color: "text-gray-900" },
    { label: "Users", value: totalUsers, color: "text-blue-600" },
    { label: "Source Articles", value: totalArticles, color: "text-gray-600" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <form action="/api/admin/ingest" method="POST">
          <Button type="submit">Run Ingestion</Button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/stories">
          <Card className="hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-1">All Stories</h3>
              <p className="text-sm text-gray-500">View and manage all stories</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/stories/pending">
          <Card className="hover:shadow-md transition-all cursor-pointer border-yellow-200">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-1">Review Queue</h3>
              <p className="text-sm text-gray-500">{pending} stories waiting for review</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/settings">
          <Card className="hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-1">Settings</h3>
              <p className="text-sm text-gray-500">Confidence threshold, ingestion settings</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
