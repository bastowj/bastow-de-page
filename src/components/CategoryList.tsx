import Link from "next/link";

interface CategoryListProps {
  categories: string[];
  activeCategory?: string;
}

export function CategoryList({
  categories,
  activeCategory,
}: CategoryListProps) {
  return (
    <div className="mb-8">
      <h3 className="blog-h3">Categories</h3>
      <div className="category-list-tags">
        <Link
          href="/texts"
          className={`category-all-link ${!activeCategory ? "active" : "inactive"}`}
        >
          All
        </Link>

        {categories.map((category) => (
          <Link
            key={category}
            href={`/texts/category/${category}`}
            className={`category-link ${activeCategory === category ? "active" : "inactive"}`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}
