import TryCatch from "../middleware/TryCatch.js";
import {Courses} from '../model/Courses.js';
import { Lecture } from '../model/Lecture.js';
import { promisify } from "util";
import {rm} from 'fs';
import fs from "fs";
import { User } from "../model/User.js";

export const createCourse = TryCatch(async(req,res)=>{ 
    const {title,description,price,category,duration,createdBy} = req.body;

    const image = req.file;

    // We use create method to save the data into data base
    const newCourse = await Courses.create({
        title,description,price,category,duration,createdBy,image: image?.path
    });

    if(newCourse) return res.status(200).json({message: "New Course Added Successfully."});
});

export const addLecture = TryCatch(async(req,res)=>{
    const courseId = req.params.id;

    if(courseId){
        // Find the course first
        const course = await Courses.findById(courseId);

        if(course){
            const { title, description } = req.body;

            const file = req.file;

            const lecture = await Lecture.create({
                title,
                description,
                video: file?.path,
                course: course._id,
            });

            return res.status(201).json({
                message: "Lecture Added",
                lecture,
            });
        }
    }
    return res.status(400).json({
        message: "Course Id Not found."
    })
});

// Delete Lecture
export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
  
    rm(lecture.video, ()=>{
      console.log("Video deleted Successfully");
    })
  
    const deleteSingleLecture = await lecture.deleteOne();
  
    if(deleteSingleLecture){
      return res.status(200).json({message: "Lecture deleted Successfully"});
    }
  });

  const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id); // get the course

  const lectures = await Lecture.find({ course: course._id });  // Get all the lecture related to particular Course

  //   Deletr all the lectures of the course
  await Promise.all(
    lectures.map(async (lecture) => {
      await unlinkAsync(lecture.video);
      console.log("video deleted");
    })
  );

//   delete the image of the course
  rm(course.image, () => {
    console.log("image deleted");
  });

//   Delete the lectures from DB
  await Lecture.find({ course: req.params.id }).deleteMany();

  
//   Delete the course from DB
  await course.deleteOne();

//   Remove the subscription
  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    message: "Course Deleted",
  });
});

export const getAllStats = TryCatch(async (req, res) => {
    const totalCoures = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length;
  
    const stats = {
      totalCoures,
      totalLectures,
      totalUsers,
    };
  
    res.json({
      stats,
    });
  });

  export const getAllUser = TryCatch(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(   // ne means not equal to 
      "-password"
    );
  
    res.json({ users });
  });
  
  export const updateRole = TryCatch(async (req, res) => {
    if (req.user.mainrole !== "superadmin")
      return res.status(403).json({
        message: "This endpoint is assign to superadmin",
      });
    const user = await User.findById(req.params.id);
  
    if (user.role === "user") {
      user.role = "admin";
      await user.save();
  
      return res.status(200).json({
        message: "Role updated to admin",
      });
    }
  
    if (user.role === "admin") {
      user.role = "user";
      await user.save();
  
      return res.status(200).json({
        message: "Role updated",
      });
    }
  });