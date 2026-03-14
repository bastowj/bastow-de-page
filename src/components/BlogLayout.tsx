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
          <h1 className="blog-h1">Stuff I write</h1>
          <LabelBar />
        </div>
      )}

      {!showLabelBar && activeCategory && (
        <div className="blog-layout-category-header">
          <h1 className="blog-h1">Category: {activeCategory}</h1>
          <p className="blog-layout-category-subtitle">
            Explore texts in the {activeCategory} category
          </p>
        </div>
      )}

      <div className="blog-layout-grid">
        {/* Sidebar with categories */}
        <div className="lg:col-span-1">
          <CategoryList categories={categories} activeCategory={activeCategory} />
        </div>

        {/* Blog posts */}
        <div className="lg:col-span-3">
          <div className="blog-layout-posts">
            {posts.length > 0 ? (
              posts.map((post) => <BlogPostPreview key={post.slug} post={post} />)
            ) : (
              <p className="blog-layout-empty">No texts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
