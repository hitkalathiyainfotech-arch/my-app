// Mock data - replace with database in real app
const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

exports.handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ users, count: users.length })
        };

      case "POST":
        const newUser = JSON.parse(event.body);
        const user = {
          id: users.length + 1,
          ...newUser,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ user, message: "User created successfully" })
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
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};