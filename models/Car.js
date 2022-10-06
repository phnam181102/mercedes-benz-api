const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const CarSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        backdrop_path: { type: String },
        detailImages: { type: Array, required: true },
        price: { type: Number, required: true },
        keyFeatures: { type: Array },
        range: { type: Number },
        topSpeed: { type: Number },
        chargingTime: { type: Number },
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    }
);

// Add plugins
mongoose.plugin(slug);

module.exports = mongoose.model('Car', CarSchema);
