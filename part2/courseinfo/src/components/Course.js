import React from 'react';


const Header = ({ name }) => {
    return (
        <h1>{name}</h1>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((s, p) => s + p.exercises, 0)

    return (
        <p>
            <strong>total of {total} exercises</strong>
        </p>
    )
}

const Part = (props) => {
    return (
        <p>
            {props.part.name} {props.part.exercises}
        </p>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header name={course.name} />
            {course.parts.map(part =>
                <Part key={part.id} part={part} />
            )}
            <Total parts={course.parts} />
        </div>
    )
}

export default Course