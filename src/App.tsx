import React, { Suspense } from 'react';
import { BrowserRouter as Router } from "react-router";
import { Loader } from '@components/Loader/Loader';
import { AppRoutes } from './routes/AppRoutes';
import AppLayout from './layouts/AppLayout';

function App(): React.JSX.Element {
  return (
    <React.Fragment>
      <Router basename={"/"}>
        <AppLayout>
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>
        </AppLayout>
      </Router>
    </React.Fragment>
  );
}

export default App;