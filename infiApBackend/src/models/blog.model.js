const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        smallHeader: { type: String },
        bigHeader: { type: String },
        content: { type: String, required: true },
        imageUrl: { type: String },
        category: { type: String, default: "Blog" },
        excerpt: { type: String },
        readTime: { type: String },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blogpost", blogSchema);
module.exports = Blog;
