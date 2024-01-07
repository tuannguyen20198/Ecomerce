const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        numberView: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        image: {
            type: String,
            default:
                'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        author: {
            type: String,
            default: 'Admin',
        },
    },
    {
        timeseries: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);
