import React, { useEffect, useState } from 'react';
import FlashcardForm from './components/FlashcardForm';
import FlashcardList from './components/FlashcardList';
import './styles.css';

function App() {
    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        fetchFlashcards();
    }, []);

    const fetchFlashcards = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/flashcards/all');
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setFlashcards(data);
        } catch (error) {
            console.error("Error fetching flashcards:", error);
        }
    };

    const createFlashcard = async (flashcard) => {
        try {
            const response = await fetch('http://localhost:8080/api/flashcards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flashcard),
            });
            if (!response.ok) throw new Error("Failed to create flashcard");
            
            const newFlashcard = await response.json();
            console.log("New flashcard created:", newFlashcard); // Log to verify
            setFlashcards([...flashcards, newFlashcard]);
        } catch (error) {
            console.error("Error creating flashcard:", error);
        }
    };

    const deleteFlashcard = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/flashcards/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Failed to delete flashcard");
            
            console.log(`Flashcard with id ${id} deleted successfully`); // Log deletion
            setFlashcards(flashcards.filter((flashcard) => flashcard.id !== id));
        } catch (error) {
            console.error("Error deleting flashcard:", error);
        }
    };

    const updateFlashcard = async (updatedFlashcard) => {
        try {
            const response = await fetch(`http://localhost:8080/api/flashcards/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFlashcard),
            });
            if (!response.ok) throw new Error("Failed to update flashcard");
            
            // Update flashcards state with the new data
            const updatedCard = await response.json();
            setFlashcards(flashcards.map((fc) => (fc.id === updatedCard.id ? updatedCard : fc)));
            console.log(`Flashcard with id ${updatedCard.id} updated successfully`); // Log update
        } catch (error) {
            console.error("Error updating flashcard:", error);
        }
    };

    return (
        <div>
            <h1>Create Flashcard</h1>
            <FlashcardForm onCreate={createFlashcard} />
            <FlashcardList 
                flashcards={flashcards} 
                onDelete={deleteFlashcard} 
                onUpdate={updateFlashcard} // Pass the update function here
            />
        </div>
    );
}

export default App;
