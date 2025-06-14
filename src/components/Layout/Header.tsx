import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1>Geometric Median</h1>
      <p className="tagline">Find the center point closest to all dots</p>
    </header>
  );
};