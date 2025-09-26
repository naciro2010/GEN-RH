import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}
ReactDOM.createRoot(rootElement).render(_jsx(React.StrictMode, { children: _jsx(HashRouter, { children: _jsx(App, {}) }) }));
