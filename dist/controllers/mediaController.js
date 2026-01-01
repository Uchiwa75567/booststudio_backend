"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'images', resource_type: 'image' }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ success: false, message: 'Upload failed' });
            }
            res.json({ success: true, url: result?.secure_url });
        });
        stream.end(file.buffer);
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
};
exports.uploadImage = uploadImage;
const uploadVideo = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'videos', resource_type: 'video' }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ success: false, message: 'Upload failed' });
            }
            res.json({ success: true, url: result?.secure_url });
        });
        stream.end(file.buffer);
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
};
exports.uploadVideo = uploadVideo;
