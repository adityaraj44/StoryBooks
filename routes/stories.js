const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

// show add page
//  get stories add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc process add form
// route post /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

// show all stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {
      stories,
      helper: require("../helper/ejs"),
    });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// show single story
// GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }

    res.render("stories/show", {
      story,
      helper: require("../helper/ejs"),
    });
  } catch (error) {
    return res.render("error/404");
  }
});

// show edit page , pass the particular story
// route stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story,
        helper: require("../helper/ejs"),
      });
    }
  } catch (error) {
    return res.render("error/500");
  }
});

// update story PUT
// route /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.redirect("/dashboard");
    }
  } catch (error) {
    return res.render("error/500");
  }
});

// update story delete
// route DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    return res.render("error/500");
  }
});

// show user stories
// GET /stories/user/:id
router.get("/user/:id", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.id,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
      helper: require("../helper/ejs"),
    });
  } catch (error) {
    return res.render("error/500");
  }
});

module.exports = router;
