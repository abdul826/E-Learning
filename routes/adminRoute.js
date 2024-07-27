import express from "express";
import { addLecture, createCourse, deleteCourse, deleteLecture, getAllStats, getAllUser, updateRole } from "../controller/adminController.js";
import { isAdmin, isAuth } from "../middleware/isAuth.js";
import { uploadFiles } from "../middleware/multer.js";

const router = express.Router();

router.post('/addcourse',isAuth,isAdmin,uploadFiles, createCourse);
router.post('/course/:id',isAuth,isAdmin,uploadFiles, addLecture);
router.delete('/lecture/:id',isAuth,isAdmin, deleteLecture);
router.delete('/course/:id',isAuth,isAdmin, deleteCourse);
router.get('/stats/',isAuth,isAdmin, getAllStats);              
router.get('/users',isAuth,isAdmin,getAllUser);
router.put('/user/:id',isAuth,isAdmin, updateRole);
export default router;