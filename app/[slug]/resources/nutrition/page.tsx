import ResourceCategoryPage from "../ResourceCategoryPage";

type NutritionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NutritionPage({
  params,
}: NutritionPageProps) {
  const { slug } = await params;

  return (
    <ResourceCategoryPage
      slug={slug}
      category="Nutrition"
      title="Nutrition"
    />
  );
}