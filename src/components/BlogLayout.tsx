import { BlogPost } from "@/lib/blog";
import { CategoryList } from "@/components/CategoryList";
import { BlogPostPreview } from "@/components/BlogPostPreview";
import { LabelBar } from "@/components/LabelBar"; // Only for the main blog page

interface BlogLayoutProps {
  posts: BlogPost[];
  categories: string[];
  activeCategory?: string;
  showLabelBar?: boolean;
}

export function BlogLayout({
  posts,
  categories,
  activeCategory,
  showLabelBar = false,
}: BlogLayoutProps) {
  return (
    <div className="main-content-wrapper">
      {showLabelBar && (
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Stuff I write</h1>
          <LabelBar />
        </div>
      )}

      {!showLabelBar && activeCategory && (
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Category: {activeCategory}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore texts in the {activeCategory} category
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with categories */}
        <div className="lg:col-span-1">
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
          />
        </div>

        {/* Blog posts */}
        <div className="lg:col-span-3">
          <div className="space-y-10">
            {posts.length > 0 ? (
              posts.map((post) => (
                <BlogPostPreview key={post.slug} post={post} />
              ))
            ) : (
              <p className="text-center py-10 text-gray-500">
                No texts found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
