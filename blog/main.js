// blog/main.js

// A super-simple approach: we will list the .md files manually.
// (For large blogs, you'd want a more robust approach or a static site generator.)
const posts = [
    'sample-post.md',
    'sample-post-2.md'
    // Add more post filenames here or generate them dynamically if you prefer
  ];
  
  const postsContainer = document.getElementById('posts-container');
  
  async function fetchPostData(filename) {
    const response = await fetch(`./blog/${filename}`);
    const text = await response.text();
  
    // Extract front matter (lines between ---)
    // This is a naive approach for demonstration purposes
    const frontMatterRegex = /^---([\s\S]*?)---/;
    const frontMatterMatch = text.match(frontMatterRegex);
  
    let frontMatter = {};
    let content = text;
  
    if (frontMatterMatch) {
      const yamlPart = frontMatterMatch[1];
      content = text.replace(frontMatterRegex, '');
      // Parse YAML (naive parse again)
      yamlPart.split('\n').forEach(line => {
        const [key, ...vals] = line.split(':');
        if (key && vals) {
          frontMatter[key.trim()] = vals.join(':').trim().replace(/"/g, '');
        }
      });
    }
  
    return {
      filename,
      title: frontMatter.title || 'Untitled Post',
      date: frontMatter.date || '2025-01-01',
      content: content.trim()
    };
  }
  
  async function displayPosts() {
    for (const filename of posts) {
      try {
        const postData = await fetchPostData(filename);
  
        // Create a container for each post
        const article = document.createElement('article');
        const heading = document.createElement('h2');
        const dateElem = document.createElement('p');
        const excerpt = document.createElement('p');
        const readMore = document.createElement('a');
  
        heading.textContent = postData.title;
        dateElem.textContent = new Date(postData.date).toDateString();
        
        // For an excerpt, just grab the first 100 characters
        excerpt.textContent = postData.content.substring(0, 100) + '...';
        
        // For "Read More", we could link to a separate page or a dynamic route.
        // For simplicity, we’ll link to the same page with a # and full content below. 
        readMore.textContent = 'Read More';
        readMore.href = `#${filename}`;
  
        // Assemble
        article.appendChild(heading);
        article.appendChild(dateElem);
        article.appendChild(excerpt);
        article.appendChild(readMore);
  
        postsContainer.appendChild(article);
  
        // If the user clicks "Read More", expand to show the entire content (simple approach)
        readMore.addEventListener('click', (e) => {
          e.preventDefault();
          excerpt.textContent = postData.content;
        });
      } catch (error) {
        console.error(`Error loading post ${filename}:`, error);
      }
    }
  }
  
  displayPosts();
  