import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter as Router } from "react-router";
import { Loader } from "@components/Loader/Loader";
import { AppRoutes } from "./routes/AppRoutes";
import AppLayout from "./layouts/AppLayout";

function App(): React.JSX.Element {
  return (
    <React.Fragment>
      <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
        <Router basename={"/"}>
          <AppLayout>
            <Suspense fallback={<Loader />}>
              <AppRoutes />
            </Suspense>
          </AppLayout>
        </Router>
      </ErrorBoundary>
    </React.Fragment>
  );
}

export default App;