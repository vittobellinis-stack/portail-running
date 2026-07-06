import ResourceCategoryPage from "../ResourceCategoryPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ResourceCategoryPage params={params} category="nutrition" />;
}