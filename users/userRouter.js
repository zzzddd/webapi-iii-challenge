const express = require("express");

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

// Endpoint to Create (POST) user - FUNCTIONAL
router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error adding the user" });
    });
});

// Endpoint to Create (POST) post by user ID - FUNCTIONAL
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };

  Posts.insert(postInfo)
    .then(post => {
      res.status(210).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error adding the post for the user" });
    });
});

// Endpoint to Retrieve (GET) users - FUNCTIONAL
router.get("/", (req, res) => {
  Users.get(req.query)
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the users" });
    });
});

// Endpoint to Retrieve (GET) user by ID - FUNCTIONAL
router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

// Endpoint to Retrieve (GET) user posts - FUNCTIONAL
router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error getting the posts for the user" });
    });
});

// Endpoint to Delete (DEL) user - FUNCTIONAL
router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The user has been deleted" });
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error removing the user" });
    });
});

// Endpoint to Update (PUT) user - FUNCTIONAL
router.put("/:id", validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "The hub could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Error updating the user"
      });
    });
});

// Custom Middleware

// Validate user ID on every request expecting user ID parameter - FUNCTIONAL
function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(400).json({ message: "Invalid user ID" });
      } else {
        req.user = req.params.id;
        next();
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error validating user ID" });
    });
  // next();
}

// Validate body on create new user request - FUNCTIONAL
function validateUser(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "Missing user data!" });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'Missing required "name" field!' });
  } else {
    next();
  }
  // next();
}

// Validate body on create new post request - FUNCTIONAL
function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "Missing post data!" });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'Missing required "text" field!' });
  } else {
    next();
  }
  // next();
}

module.exports = router;
