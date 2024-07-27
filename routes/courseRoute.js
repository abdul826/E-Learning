import express from "express";
import { checkout, fetchLecture, fetchLectures, getAllCourses, fetchMyCourse, getSingleCourse, paymentVerification } from "../controller/courseController.js";
import {isAuth} from '../middleware/isAuth.js';

const router = express.Router();

router.get('/test',isAuth, fetchMyCourse);
router.get('/all', getAllCourses);
router.get('/:id',getSingleCourse);
router.get('/lectures/:id',isAuth,fetchLectures);
router.get('/lecture/:id',isAuth,fetchLecture);
// router.get('/mycourse',isAuth,getMyCourses);
router.post("/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);


export default router;