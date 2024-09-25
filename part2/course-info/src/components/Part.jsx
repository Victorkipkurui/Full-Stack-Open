import React from 'react';

const Part = ({ courses }) => {
  return (
    <>
      <div>
        {courses.map((course) => {
          const totalExercises = course.parts.reduce(
            (sum, part) => sum + part.exercises, 
            0
          );

          return (
            <div key={course.id}>
              <h2>{course.name}</h2>
              {course.parts.map((part) => (
                <div key={part.id}>
                  {part.name} {part.exercises}
                </div>
              ))}
              {/* Display total exercises for the current course */}
              <div>
                <b>Total of {totalExercises} exercises</b>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Part;
