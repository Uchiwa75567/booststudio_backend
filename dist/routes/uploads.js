"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const mediaController_1 = require("../controllers/mediaController");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post('/image', upload.single('file'), mediaController_1.uploadImage);
router.post('/video', upload.single('file'), mediaController_1.uploadVideo);
exports.default = router;
