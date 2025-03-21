import React, { Suspense } from 'react';
import { BrowserRouter as Router } from "react-router";
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

function App(): React.JSX.Element {
  return (
    <Router basename={"/"}>
      <Suspense fallback={<span>Loading...</span>}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
}

export default App;