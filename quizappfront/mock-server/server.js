import jsonServer from "json-server";
import { tr } from "zod/v4/locales";
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);


server.get("/stats", (req, res) => {
  res.json({
    userCount: 2,
    postCount: 3,
    timestamp: new Date().toISOString()
  });
});


server.get("/users", (req, res) => {
  const users = [
    {
      "id":"1",
      "name": "ali",
      "email": "ali@gamil.com"
    }
  ]
  res.json(users);
});


server.get("/api/my-tests", (req, res) => {
  const data = [
    {
      "id":"1",
      "nomi": "Matem 30 talik",
      "created_at": "2025-11-21T14:53:20.018047Z"
    },
    {
      "id":"2",
      "nomi": "Ona tili 30 talik",
      "created_at": "2025-11-21T14:53:20.018047Z"
    }
  ]
  res.json(data);
});


server.get("/api/tests/1/questions", (req, res) => {
  const data = [
    {
      "id":"1",
      "title": "question 1",
      "answers": [
        {
          "title": "jsac",
          "is_correct": false
        },
        {
          "title": "qwq",
          "is_correct": true
        }
      ],
      "created_at": "2025-11-21T14:53:20.018047Z"
    },
    {
      "id":"2",
      "title": "question 2",
      "answers": [
        {
          "title": "jsac",
          "is_correct": false
        },
        {
          "title": "qwq",
          "is_correct": true
        }
      ],
      "created_at": "2025-11-21T14:53:20.018047Z"
    }
  ]
  res.json(data);
});


server.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    return res.json({ accessToken: "mock-token-abc123", "user": {"username": "admin", "user_id": "1"} });
  }

  res.status(401).json({ error: "Invalid credentials" });
});


server.listen(4000, () => {
  console.log("Mock API running on http://localhost:4000");
});
