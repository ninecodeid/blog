import { Button } from "@/components/ui/button";
import type { Category } from "~backend/blog/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | "All";
  onCategoryChange: (categoryId: number | "All") => void;
}

export default function CategoryFilter({ categories, selectedCategoryId, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      <Button
        variant={selectedCategoryId === "All" ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange("All")}
        className={
          selectedCategoryId === "All"
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600"
        }
      >
        Semua
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={
            selectedCategoryId === category.id
              ? "text-white border-0"
              : "border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600"
          }
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
