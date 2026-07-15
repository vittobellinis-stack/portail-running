import ResourceCategoryPage from "../ResourceCategoryPage";

type RunningPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RunningPage({
  params,
}: RunningPageProps) {
  const { slug } = await params;

  return (
    <ResourceCategoryPage
      slug={slug}
      category="Running"
      title="Running"
    />
  );
}