interface MenuCategoryProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function MenuCategory({
  categories,
  selectedCategory,
  onSelectCategory,
}: MenuCategoryProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectCategory(null)}
        className={`category-pill ${selectedCategory === null ? 'category-pill-active' : 'category-pill-inactive'}`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`category-pill ${selectedCategory === category ? 'category-pill-active' : 'category-pill-inactive'}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
