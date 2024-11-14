import React, { useState } from 'react';

const FlashcardItem = ({ flashcard, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedFlashcard, setUpdatedFlashcard] = useState({ ...flashcard });

    const handleEditClick = () => {
        setIsEditing(true);
    };
//jhgktkkjgy
    const handleSaveClick = () => {
        onUpdate(updatedFlashcard); // Call the update function with the modified flashcard
        setIsEditing(false); // Exit edit mode
    };

    const handleCancelClick = () => {
        setIsEditing(false); // Cancel edit mode without saving
        setUpdatedFlashcard({ ...flashcard }); // Reset changes
    };

    return (
        <li>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={updatedFlashcard.question}
                        onChange={(e) =>
                            setUpdatedFlashcard({ ...updatedFlashcard, question: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        value={updatedFlashcard.answer}
                        onChange={(e) =>
                            setUpdatedFlashcard({ ...updatedFlashcard, answer: e.target.value })
                        }
                    />
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            ) : (
                <div>
                    <strong>{flashcard.question}</strong>: {flashcard.answer}
                    <button onClick={handleEditClick}>Edit</button>
                    <button onClick={() => onDelete(flashcard.id)}>Delete</button>
                </div>
            )}
        </li>
    );
};

export default FlashcardItem;
