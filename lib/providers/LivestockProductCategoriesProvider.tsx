import { useEffect } from "react";

// This store would need to be created if it doesn't exist
// import { useLivestockProductCategoryStore } from "@/lib/stores/livestockProductCategoryStore";

export default function LivestockProductCategoriesProvider({ children }: { children: React.ReactNode }) {
  // const categories = useLivestockProductCategoryStore((s) => s.categories);
  // const isLoading = useLivestockProductCategoryStore((s) => s.isLoading);
  // const fetchCategories = useLivestockProductCategoryStore((s) => s.fetchCategories);

  useEffect(() => {
    // fetchCategories();
    // Uncomment when store is available
  }, []);

  return <>{children}</>;
}

