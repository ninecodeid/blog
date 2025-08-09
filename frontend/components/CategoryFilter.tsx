import { Button } from "@/components/ui/button";
import type { Category } from "~backend/blog/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | "All";
  onCategoryChange: (categoryId: number | "All") => void;
}

export default function CategoryFilter({ categories, selectedCategoryId, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
      <Button
        variant={selectedCategoryId === "All" ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange("All")}
        className={`transition-all duration-300 hover:scale-105 ${
          selectedCategoryId === "All"
            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl border-0"
            : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        }`}
      >
        Semua
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={`transition-all duration-300 hover:scale-105 ${
            selectedCategoryId === category.id
              ? "text-white border-0 shadow-lg hover:shadow-xl"
              : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          }`}
          style={
            selectedCategoryId === category.id
              ? { 
                  background: `linear-gradient(135deg, ${category.color}, ${category.color}DD)`,
                  boxShadow: `0 4px 20px ${category.color}40`
                }
              : {}
          }
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
