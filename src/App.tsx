import React from 'react';
import { createRoot } from 'react-dom/client';
import Puzzle from './Puzzle';

export const renderApp = () => {
    const rootElement = document.getElementById('app');
    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(<Puzzle />);
    }
};