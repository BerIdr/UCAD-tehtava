import http from "http";

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/items") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify([
        { id: 1, name: "Item1" },
        { id: 2, name: "Item2" },
      ]),
    );
  } else if (req.method === "GET" && req.url === "/items/1") {
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: 1, name: "Item1" }));
  } else if (req.method === "POST" && req.url === "/items") {
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: 3, name: "New Item" }));
  } else if (req.method === "PUT" && req.url.startsWith("/items")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: 1, name: "Updated Item" }));
  } else if (req.method === "DELETE" && req.url.startsWith("/items")) {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
