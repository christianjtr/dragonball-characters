import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter as Router } from "react-router";

import { Loader } from "@components/Loader/Loader";
import { APP_BASE_PATH } from "@config/appConfig";
import { ArcadeSettingsProvider } from "@context/ArcadeSettingsProvider";
import { RosterProvider } from "@context/RosterProvider";
import { AppRoutes } from "./routes/AppRoutes";
import { ErrorBoundaryState } from "./layouts/ErrorBoundaryState/ErrorBoundaryState";
import AppLayout from "./layouts/AppLayout";

function App(): React.JSX.Element {
  return (
    <React.Fragment>
      <ErrorBoundary fallback={<ErrorBoundaryState />}>
        <Router basename={APP_BASE_PATH}>
          <ArcadeSettingsProvider>
            <RosterProvider>
              <AppLayout>
                <Suspense fallback={<Loader />}>
                  <AppRoutes />
                </Suspense>
              </AppLayout>
            </RosterProvider>
          </ArcadeSettingsProvider>
        </Router>
      </ErrorBoundary>
    </React.Fragment>
  );
}

export default App;
