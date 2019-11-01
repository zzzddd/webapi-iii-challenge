const express = require("express");

const Posts = require("./postDb");

const router = express.Router();

// Endpoint to Retrieve (GET) posts - FUNCTIONAL
router.get("/", (req, res) => {
  Posts.get(req.query)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the posts" });
    });
});

// Endpoint to Retrieve (GET) posts by id - FUNCTIONAL
router.get("/:id", validatePostId, (req, res) => {
  Posts.getById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the post" });
    });
});

// Endpoint to Delete (DEL) post - FUNCTIONAL
router.delete("/:id", validatePostId, (req, res) => {
  Posts.remove(req.params.id)
    .then(count =>
      res.status(200).json({ message: "The post has been deleted" })
    )
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error removing the post" });
    });
});

// Endpoint to Update (PUT) post - FUNCTIONAL
router.put("/:id", validatePostId, (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(post => res.status(200).json(post))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error updating the post" });
    });
});

// Custom Middleware

// Validate post ID on every request expecting post ID parameter - FUNCTIONAL
function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(400).json({ message: "Invalid post ID" });
      } else {
        req.post = req.params.id;
        next();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error validating post ID" });
    });
  // next();
}

module.exports = router;
