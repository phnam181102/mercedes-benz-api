const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const CarSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true },
        avatar: { type: Array },
        detailImages: { type: Array },
        keyFeatures: { type: Array },
        range: { type: String },
        topSpeed: { type: String },
        chargingTime: { type: String },
        modelType: { type: String },
        bodyType: { type: String },
        new: { type: String },
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    }
);

// Add plugins
mongoose.plugin(slug);

module.exports = mongoose.model('Car', CarSchema);
