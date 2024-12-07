import React, { useState, useEffect } from 'react';
import { data } from './data';

export default function Quiz() {
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(data[index]);
    const [timeLeft, setTimeLeft] = useState(60); // Initialize timer state
    const [score, setScore] = useState(0); // Initialize score state
    const [selectedOption, setSelectedOption] = useState(null); // To track the selected radio button

    useEffect(() => {
        setQuestion(data[index]); // Update the question when the index changes
        setTimeLeft(60); // Reset timer for each question
        setSelectedOption(null); // Reset the selected option for the next question
    }, [index]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            nextQuestion(); // Automatically go to the next question when time runs out
        }
    }, [timeLeft]);

    const checkAns = (e, ans) => {
        // Apply the result for the selected radio button
        const isCorrect = question.ans === ans;
        if (isCorrect) {
            setScore(score + 1); // Increment score for correct answer, ensuring it doesn't exceed the limit
        }

        // Clear all radio button states (class updates)
        const radios = e.target.closest("ul").querySelectorAll("input[type='radio']");
        radios.forEach((radio) => {
            const label = radio.closest('label');
            label.classList.remove('text-success', 'text-danger');
            label.classList.add('text-muted');
        });

        // Apply the result for the selected radio button
        const selectedLabel = e.target.closest('label');
        if (isCorrect) {
            selectedLabel.classList.add("text-success");  // Correct answer
        } else {
            selectedLabel.classList.add("text-danger");   // Incorrect answer
        }

        // Move to the next question immediately after answering
        nextQuestion();
    };

    const nextQuestion = () => {
        if (index < data.length - 1) {
            setIndex(index + 1); // Go to the next question
        } else {
            alert(`Quiz finished! Your score: ${score}/${data.length}`); // Show score on last question
        }
    };

    return (
        <main className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <section className="card p-3 shadow-sm w-50">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Time Left: <span className="badge bg-danger">{timeLeft}s</span></h5>
                </div>
                <h1>
                    {index + 1}. {question.question}
                </h1>
                <hr />
                <ul className="list-unstyled">
                    {question.option.map((option, i) => (
                        <li key={i} className="mb-2">
                            <label className="d-flex align-items-center">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={i + 1}
                                    checked={selectedOption === i + 1}
                                    onChange={(e) => {
                                        setSelectedOption(Number(e.target.value));  // Track the selected option
                                        checkAns(e, Number(e.target.value)); // Check the answer immediately after selection
                                    }}
                                    className="me-2"
                                />
                                {option}
                            </label>
                        </li>
                    ))}
                </ul>
                <hr />
                {/* Remove the "Next Question" button because the question changes automatically */}
                {index === data.length - 1 && (
                    <h4 className='bg-warning p-2 rounded text-center'>Your Final Score: {score}/{data.length}</h4> // Display score after last question
                )}
            </section>
        </main>
    );
}
