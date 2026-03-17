const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} = require("../controllers/blog.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { verifyRole } = require("../middlewares/role.middleware");

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Admin only routes
router.post("/", verifyJWT, verifyRole(["admin", "manager"]), upload.single("imageUrl"), createBlog);
router.put("/:id", verifyJWT, verifyRole(["admin", "manager"]), upload.single("imageUrl"), updateBlog);
router.delete("/:id", verifyJWT, verifyRole(["admin"]), deleteBlog);

module.exports = router;
