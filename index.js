const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const code = `Welcome to Notebin
Type in your note
Save to create a unique url for your note
Share it!`;

  res.render("code-display", {
    code,
    language: "language-plaintext",
  });
});

app.get("/new", async (req, res) => {
  res.render("new", { canSave: true });
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  const post = await prisma.post.create({
    data: {
      body: value,
    },
  });
  res.redirect(`/${post.id}`);
});

//render code display page
app.get("/:id", async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
  });
  if (!post) {
    res.send("not found");
  }
  res.render("code-display", { code: post.body, id: post.id });
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  const post = await prisma.post.findUnique({
    where: { id },
  });
  res.render("new", { value: post.body, canSave: true });
});

app.listen(8080, () => {
  console.log("server running on 8080");
});
