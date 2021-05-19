import React, { useState } from 'react'

const Display = ({ value }) => <h1>{value}</h1>

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>
        {text}
    </button>
)

const Statistic = ({ text, value }) => (
    <tr>
        <td>{text} </td>
        <td>{value}</td>
    </tr>
)

const Statistics = ({ good, neutral, bad, all }) => {
    if (all > 0) {
        return (
            <table>
                <Statistic text={"good"} value={good} />
                <Statistic text={"neutral"} value={neutral} />
                <Statistic text={"bad"} value={bad} />
                <Statistic text={"all"} value={all} />
                <Statistic text={"average"} value={(good + ((-1) * bad)) / all} />
                <Statistic text={"positive"} value={((good / all) * 100) + " %"} />
            </table>
        )
    } else {
        return (<div>No feedback given</div>)
    }
}



const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [all, setAll] = useState(0)

    const setToGood = newValue => {
        setGood(newValue)
        setToAll(all + 1)
    }

    const setToBad = newValue => {
        setBad(newValue)
        setToAll(all + 1)
    }

    const setToNeutral = newValue => {
        setNeutral(newValue)
        setToAll(all + 1)
    }
    const setToAll = newValue => {
        setAll(newValue)
    }

    return (
        <div>
            <Display value={"give feedback"} />
            <Button handleClick={() => setToGood(good + 1)} text="good" />
            <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
            <Button handleClick={() => setToBad(bad + 1)} text="bad" />
            <Display value={"statistics"} />
            <Statistics good={good} neutral={neutral} bad={bad} all={all} />


        </div>
    )
}

export default App