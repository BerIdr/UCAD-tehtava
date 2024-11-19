import express from "express";
import {
  getMediaItems,
  postMediaItem,
  getMediaItemsById,
  mediaItems,
} from "./media.js";
const hostname = "127.0.0.1";
const port = 3000;
const app = express();

app.set("view engine", "pug");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.static("public"));
app.use("/media", express.static("media"));

app.get("/api", (req, res) => {
  res.render("index", {
    title: "Media API",
    message: "Welcome to the Media API",
    exampleData: mediaItems,
  });
});

app.get("/api/media", (req, res) => {
  getMediaItems(res);
});

app.get("/api/media/:media_id", (req, res) => {
  getMediaItemsById(req, res);
});

app.post("/api/media", (req, res) => {
  postMediaItem(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
