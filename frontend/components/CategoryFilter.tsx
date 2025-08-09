import { Button } from "@/components/ui/button";
import type { ArticleCategory } from "~backend/blog/types";

interface CategoryFilterProps {
  selectedCategory: ArticleCategory | "All";
  onCategoryChange: (category: ArticleCategory | "All") => void;
}

const categories: Array<{ label: string; value: ArticleCategory | "All" }> = [
  { label: "Semua", value: "All" },
  { label: "Hardware", value: "Hardware" },
  { label: "Software", value: "Software" },
  { label: "Tips", value: "Tips" },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className={
            selectedCategory === category.value
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "border-slate-600 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400"
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
