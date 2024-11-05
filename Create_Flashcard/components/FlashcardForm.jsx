import React, { useState } from 'react';

const FlashcardForm = ({ onCreate }) => {
    const [numberOfQuestion, setNumberOfQuestion] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({ numberOfQuestion: Number(numberOfQuestion), question, answer });
        setNumberOfQuestion('');
        setQuestion('');
        setAnswer('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                placeholder="Number of Questions"
                value={numberOfQuestion}
                onChange={(e) => setNumberOfQuestion(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
            />
            <button type="submit">Create Flashcard</button>
        </form>
    );
};

export default FlashcardForm;
