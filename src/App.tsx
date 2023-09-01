import React, { useEffect, useState } from 'react';
import { Container, Button, Grid, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import './App.css';

const Maze: React.FC = () => {
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [completed, setCompleted] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fastTracked, setFastTracked] = useState(false);

    const gridSize = 5;

    const emojis = ["🥴", "😵‍💫", "🤮"];

    const generateRandomEmojiPositions = (size: number, count: number) => {
        const positions = new Set<string>();

        while (positions.size < count) {
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            positions.add(`${x}-${y}`);
        }

        return positions;
    };

    const [emojiPositions, setEmojiPositions] = useState<Set<string>>(
        generateRandomEmojiPositions(gridSize, 9)
    );

    const fastTrackToNextRow = () => {
        let { x, y } = position;

        // Move to the next row, if possible
        if (y < gridSize - 1) {
            y++;
            x = 0;  // Move to the first cell in the next row
        } else {
            // If already in the last row, move to the goal
            x = gridSize - 1;
            y = gridSize - 1;
        }

        setPosition({ x, y });

        setFastTracked(true);

        // Check for goal reached
        if (x === gridSize - 1 && y === gridSize - 1) {
            setCompleted(true);
        }
    };

    const move = (dir: 'left' | 'right') => {
        let { x, y } = position;
        const totalCells = gridSize * gridSize;

        let linearPos = y * gridSize + x;  // Convert 2D coordinates to 1D

        if (dir === 'left') linearPos = linearPos > 0 ? linearPos - 1 : linearPos;
        if (dir === 'right') linearPos = linearPos < totalCells - 1 ? linearPos + 1 : linearPos;

        // Convert back to 2D coordinates
        x = linearPos % gridSize;
        y = Math.floor(linearPos / gridSize);

        setPosition({ x, y });

        if (completed && (x !== gridSize - 1 || y !== gridSize - 1)) {
            setCompleted(false);
        }

        if (x === gridSize - 1 && y === gridSize - 1) {
            setCompleted(true);
        }
    };

    useEffect(() => {
        if (completed) {
            setDialogOpen(true);
        }
    }, [completed]);

    useEffect(() => {
        if (completed) {
            setEmojiPositions(new Set<string>());
        } else {
            setEmojiPositions(generateRandomEmojiPositions(gridSize, 9));
        }
    }, [completed]);

    return (
        <Container className="maze-container">
            <Typography variant="h4" className="maze-title">
                This is how you navigate a typical project
            </Typography>
            <Grid container className="maze-grid">
                {Array.from({ length: gridSize }, (_, y) =>
                    Array.from({ length: gridSize }, (_, x) => (
                        <Grid
                            item
                            key={`${x}-${y}`}
                            className={`maze-cell ${position.x === x && position.y === y ? 'current' : ''} ${x === gridSize - 1 && y === gridSize - 1 ? 'goal' : ''}`}
                        >
                            {emojiPositions.has(`${x}-${y}`) ? emojis[Math.floor(Math.random() * emojis.length)] : ""}
                        </Grid>
                    ))
                )}
            </Grid>
            <div className="buttons">
                <Button variant="contained" color="primary" onClick={() => move('left')}>
                    Left
                </Button>
                <Button variant="contained" color="primary" onClick={() => move('right')}>
                    Right
                </Button>
            </div>
            {completed && <Typography variant="h5" className="completed" style={{ margin: '20px 0 10px' }}>Goal Reached!</Typography>}
            {!completed && <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <Button variant="contained" color="secondary" onClick={fastTrackToNextRow}>
                    Fast Track to Next Row
                </Button>
            </div>}
            {completed && (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>
                    {fastTracked ? (
                                "I Know You Fast-tracked! 😉"
                            ) : (
                                "Did you really go through all of that?! 🥴"
                            )}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {fastTracked ? (
                                "A-ha, I noticed that you were tempted to fast-track a project. And for good reason. No project should be manually repetitive. This is exactly what Backstage does for you. With Backstage, you can automate the tedious steps and re-use these steps on other recipes that you create."
                            ) : (
                                "You've reached the goal without fast-tracking. While that's commendable, automation can help simplify your project journey."
                            )}
                        </DialogContentText>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default Maze;
