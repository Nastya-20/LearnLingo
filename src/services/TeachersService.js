import { database } from "../firebase";
import { ref, set, push } from "firebase/database";

export function addTeacher(teacherData) {
  const teacherRef = push(ref(database, "teachers")); 
  return set(teacherRef, teacherData)
    .then(() => {
      console.log("Teacher added successfully!");
    })
    .catch((error) => {
      console.error("Error adding teacher:", error);
    });
}