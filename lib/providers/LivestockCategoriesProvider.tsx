import { useEffect } from "react";

// This store would need to be created if it doesn't exist
// import { useLivestockCategoryStore } from "@/lib/stores/livestockCategoryStore";

export default function LivestockCategoriesProvider({ children }: { children: React.ReactNode }) {
  // const hierarchy = useLivestockCategoryStore((s) => s.hierarchy);
  // const isLoading = useLivestockCategoryStore((s) => s.isLoading);
  // const fetchHierarchy = useLivestockCategoryStore((s) => s.fetchHierarchy);

  useEffect(() => {
    // fetchHierarchy();
    // Uncomment when store is available
  }, []);

  return <>{children}</>;
}

