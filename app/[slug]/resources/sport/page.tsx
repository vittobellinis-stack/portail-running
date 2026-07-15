import ResourceCategoryPage from "../ResourceCategoryPage";

type SportPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SportPage({
  params,
}: SportPageProps) {
  const { slug } = await params;

  return (
    <ResourceCategoryPage
      slug={slug}
      category="Sport"
      title="Sport"
    />
  );
}