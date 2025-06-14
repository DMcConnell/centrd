import React from 'react';
import { Header } from './components/Layout/Header';
import { GameContainer } from './components/Layout/GameContainer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <GameContainer />
    </div>
  );
}

export default App;