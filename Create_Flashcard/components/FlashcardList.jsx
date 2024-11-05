import React from 'react';
import FlashcardItem from './FlashcardItem';

const FlashcardList = ({ flashcards, onDelete, onUpdate }) => {
    return (
        <ul>
            {flashcards.map((flashcard) => (
                <FlashcardItem
                    key={flashcard.id}
                    flashcard={flashcard}
                    onDelete={onDelete} 
                    onUpdate={onUpdate}
                    
                />
            ))}
        </ul>
    );
};

export default FlashcardList;
