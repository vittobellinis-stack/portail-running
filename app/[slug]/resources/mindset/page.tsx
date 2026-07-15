import ResourceCategoryPage from "../ResourceCategoryPage";

type MindsetPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MindsetPage({
  params,
}: MindsetPageProps) {
  const { slug } = await params;

  return (
    <ResourceCategoryPage
      slug={slug}
      category="Mindset"
      title="Mindset"
    />
  );
}