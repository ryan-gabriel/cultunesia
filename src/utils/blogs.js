export const fetchBlogs = async () => {
  try {
    const response = await fetch('/api/blogs', {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch blogs');
    }

    const data = await response.json();
    return data.blogs; // pastikan API kamu return { blogs: [...] }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};


export const fetchBlogBySlug = async (slug) => {
  try {
    const response = await fetch(`/api/blogs/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch blog');
    }

    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

// Helper function to generate URL-friendly slug
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with a single hyphen
    .trim();                  // Trim leading/trailing hyphens
}