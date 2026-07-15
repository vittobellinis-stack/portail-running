import ResourceCategoryPage from "../ResourceCategoryPage";

type SciencePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SciencePage({
  params,
}: SciencePageProps) {
  const { slug } = await params;

  return (
    <ResourceCategoryPage
      slug={slug}
      category="Science"
      title="Science"
    />
  );
}