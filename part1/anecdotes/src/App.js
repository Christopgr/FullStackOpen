import React, { useState } from 'react'

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>
        {text}
    </button>
)

const DisplayAnecdote = ({ anecdote, votes }) => (
    <>
        <div>
            {anecdote}
        </div>
        <div>
            has {votes}
        </div>
    </>
)

const Title = ({ text }) => <h1>{text}</h1>

const App = () => {

    const [selected, setSelected] = useState(0)

    const anecdotes = [
        {
            anecdote: 'If it hurts, do it more often',
            votes: 0
        },
        {
            anecdote: 'Adding manpower to a late software project makes it later!',
            votes: 0
        },
        {
            anecdote: 'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
            votes: 0
        },
        {
            anecdote: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
            votes: 0
        },
        {
            anecdote: 'Premature optimization is the root of all evil.',
            votes: 0
        },
        {
            anecdote: 'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
            votes: 0
        }
    ]

    const [anecdotesState, setAnecdotes] = useState(anecdotes)
    const [mostVoted, setMostVoted] = useState({ anecdote: '', votes: 0 })



    const generateRandomNumber = () => {
        let randomNum = Math.floor(Math.random() * (anecdotes.length - 1));
        setSelected(randomNum)
    }

    const setToAnecdotes = () => {
        let copy = [...anecdotesState];
        copy[selected].votes += 1;
        setAnecdotes(copy)

        let maxVoted = mostVoted;
        copy.forEach(element => {
            if (element.votes > mostVoted.votes) {
                maxVoted = element;
            }
        });
        setMostVoted(maxVoted)
    }




    return (
        <>
            <Title text={"Anecdote of the day"} />
            <DisplayAnecdote anecdote={anecdotesState[selected].anecdote} votes={anecdotesState[selected].votes} />
            <Button handleClick={() => setToAnecdotes()} text={"vote"} />
            <Button handleClick={() => generateRandomNumber()} text={"next anecdote"} />
            <Title text={"Anecdote with most votes"} />
            <DisplayAnecdote anecdote={mostVoted.anecdote} votes={mostVoted.votes} />
        </>

    )
}

export default App