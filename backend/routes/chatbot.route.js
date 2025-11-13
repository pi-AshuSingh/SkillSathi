import express from "express";
import { handleChatQuery } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.route("/query").post(handleChatQuery);

export default router;
