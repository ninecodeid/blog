import { Button } from "@/components/ui/button";
import type { Category } from "~backend/blog/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | "All";
  onCategoryChange: (categoryId: number | "All") => void;
}

export default function CategoryFilter({ categories, selectedCategoryId, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
      <Button
        variant={selectedCategoryId === "All" ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange("All")}
        className={`transition-colors duration-200 ${
          selectedCategoryId === "All"
            ? "bg-blue-600 hover:bg-blue-700 text-white border-0"
            : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={`transition-colors duration-200 ${
            selectedCategoryId === category.id
              ? "text-white border-0"
              : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          style={
            selectedCategoryId === category.id
              ? { backgroundColor: category.color }
              : {}
          }
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
