const posts = [
  { id: 1, title: "First Post", content: "Hello World", author: "John" },
  { id: 2, title: "Second Post", content: "Learning Serverless", author: "Jane" }
];

exports.handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Extract ID from path if present
  const pathSegments = event.path.split('/').filter(Boolean);
  const postId = pathSegments[pathSegments.length - 1];
  const isNumericId = !isNaN(postId);

  try {
    switch (event.httpMethod) {
      case "GET":
        if (isNumericId) {
          // Get single post
          const post = posts.find(p => p.id === parseInt(postId));
          if (!post) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: "Post not found" })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ post })
          };
        } else {
          // Get all posts
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ posts, count: posts.length })
          };
        }

      case "POST":
        const newPost = JSON.parse(event.body);
        const post = {
          id: posts.length + 1,
          ...newPost,
          createdAt: new Date().toISOString()
        };
        posts.push(post);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ post, message: "Post created successfully" })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: "Method not allowed" })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};