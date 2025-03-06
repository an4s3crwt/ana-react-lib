import React, { useMemo, Suspense } from 'react';
import { useTheme } from '@mui/material/styles';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorContent } from './contents/ErrorContent';
import { ViewContainer } from './containers/ViewContainer';
import { Indicator1 } from './indicators';

const ViewInjector = ({ navigationElement, onImportView }) => {
  const theme = useTheme();

  const GenericView = useMemo(() => {
    return onImportView(navigationElement);
  }, [navigationElement.key]);

  return (
    <ErrorBoundary
      sourceName={navigationElement.importPath}
      onRenderFallback={(source, error, errorInfo) => (
        <ViewContainer isScrollLocked={true}>
          <ErrorContent sourceName={source} errorMessage={error?.toString()} stackInfo={errorInfo.componentStack} />
        </ViewContainer>
      )}
    >
      <Suspense fallback={
        <ViewContainer isScrollLocked={true}>
          <Indicator1 color={theme.palette.primary.main} scale={2.0} />
        </ViewContainer>
      }>
        <GenericView />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ViewInjector;