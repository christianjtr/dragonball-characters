import React from 'react';
import './App.css';
import { useFetchCharacters } from './hooks/useFetchCharacters';

function App() {
  const { characters } = useFetchCharacters();

  return (
    <React.Fragment>
      {characters?.map((eachCharacter) => (
        <pre key={eachCharacter.id} style={{ textAlign: 'left' }}>{JSON.stringify(eachCharacter, null, 2)}</pre>
      ))}
    </React.Fragment>
  );
}

export default App;
