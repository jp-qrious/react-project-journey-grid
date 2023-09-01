import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Confetti from 'react-confetti';

const App: React.FC = () => {
    const [completedA, setCompletedA] = useState(false);
    const [completedB, setCompletedB] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const puzzleARef = useRef<SVGSVGElement>(null);
    const puzzleBRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        drawPuzzle(10, puzzleARef.current!, setCompletedA);
        drawPuzzle(3, puzzleBRef.current!, setCompletedB);
    }, []);

    const drawPuzzle = (pieces: number, ref: SVGSVGElement, setCompleted: React.Dispatch<React.SetStateAction<boolean>>) => {
        const svg = d3.select(ref).attr('width', 400).attr('height', 400);

        for (let i = 0; i < pieces; i++) {
            svg
                .append('rect')
                .attr('x', 10 + i * 20)
                .attr('y', 10)
                .attr('width', 20)
                .attr('height', 20)
                .attr('fill', 'grey')
                .attr('id', `piece-${i}`)
                .call(
                    d3.drag().on('drag', function (event) {
                        d3.select(this).attr('x', event.x).attr('y', event.y);
                    })
                )
                .on('click', function () {
                    if (
                        parseFloat(d3.select(this).attr('x')!) >= 300 &&
                        parseFloat(d3.select(this).attr('y')!) >= 300
                    ) {
                        setCompleted(true);
                        setShowConfetti(true);
                    }
                });
        }
    };

    return (
        <Container maxWidth="md" style={{ textAlign: 'center' }}>
            {showConfetti && <Confetti />}
            <h1>Puzzle for Application A</h1>
            <svg ref={puzzleARef}></svg>
            <h1>Puzzle for Application B</h1>
            <svg ref={puzzleBRef}></svg>

            <Dialog open={completedA}>
                <DialogTitle>You have chosen</DialogTitle>
                <DialogContent>Application A</DialogContent>
                <DialogActions>
                    <Button onClick={() => setCompletedA(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={completedB}>
                <DialogTitle>You have chosen</DialogTitle>
                <DialogContent>Application B</DialogContent>
                <DialogActions>
                    <Button onClick={() => setCompletedB(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default App;
