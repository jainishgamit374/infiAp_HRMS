const Blog = require("../models/blog.model");
const uploadFile = require("../services/storage.service");

// Create a new blog post
const createBlog = async (req, res) => {
    try {
        const { title, smallHeader, bigHeader, content } = req.body;
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            const uploadResult = await uploadFile(req.file.buffer);
            imageUrl = uploadResult.url;
        }

        if (!title || !content || !imageUrl) {
            return res.status(400).json({ message: "Missing required fields: title, content, or imageUrl" });
        }

        const blog = await Blog.create({
            title,
            smallHeader,
            bigHeader,
            content,
            imageUrl,
            author: req.user?._id,
        });

        res.status(201).json({ message: "Blog post created successfully", blog });
    } catch (error) {
        console.error("Create Blog Error:", error);
        res.status(500).json({ message: "Server error while creating blog post" });
    }
};

// Get all blog posts
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "name email").sort({ createdAt: -1 });
        res.status(200).json({ message: "Blogs fetched successfully", blogs });
    } catch (error) {
        console.error("Get All Blogs Error:", error);
        res.status(500).json({ message: "Server error while fetching blogs" });
    }
};

// Get single blog post by ID
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id).populate("author", "name email");

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        res.status(200).json({ message: "Blog fetched successfully", blog });
    } catch (error) {
        console.error("Get Blog By ID Error:", error);
        res.status(500).json({ message: "Server error while fetching blog" });
    }
};

// Update a blog post
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, smallHeader, bigHeader, content } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        if (req.file) {
            const uploadResult = await uploadFile(req.file.buffer);
            blog.imageUrl = uploadResult.url;
        } else if (req.body.imageUrl) {
            blog.imageUrl = req.body.imageUrl;
        }

        if (title) blog.title = title;
        if (smallHeader) blog.smallHeader = smallHeader;
        if (bigHeader) blog.bigHeader = bigHeader;
        if (content) blog.content = content;

        await blog.save();
        res.status(200).json({ message: "Blog post updated successfully", blog });
    } catch (error) {
        console.error("Update Blog Error:", error);
        res.status(500).json({ message: "Server error while updating blog post" });
    }
};

// Delete a blog post
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
        console.error("Delete Blog Error:", error);
        res.status(500).json({ message: "Server error while deleting blog post" });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};
