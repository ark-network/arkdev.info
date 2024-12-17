function getBlogPosts() {
  // This is a build-time require of all blog posts
  const blogContext = require.context('../../blog', false, /\.md$/)
  
  return blogContext.keys()
    .map(key => {
      const post = blogContext(key)
      const id = key.replace(/^\.\//, '').replace(/\.md$/, '')
      return {
        id,
        title: post.metadata.title,
        description: post.metadata.description,
        date: post.metadata.date,
        authors: post.metadata.authors,
        tags: post.metadata.tags,
        permalink: post.metadata.permalink,
        image: post.metadata.frontMatter?.image
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3) // Get only the latest 3 posts
}

export default getBlogPosts 