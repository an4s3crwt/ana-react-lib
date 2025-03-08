import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Box } from '@mui/material';

export const AutoSizeContainer = (props) => {

  // States
  const [isResizing, setResizing] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  // Refs
  const containerRef = useRef(null);
  const resizeTimeoutHandleRef = useRef(-1);

  const isResizingRef = useRef(isResizing);
  isResizingRef.current = isResizing;

  const heightRef = useRef(height);
  heightRef.current = height;

  const widthRef = useRef(width);
  widthRef.current = width;

  // Effects
  useEffect(() => {
    // Mount
    window.addEventListener('resize', handleWindowResize);

    // Unmount
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useLayoutEffect(() => {
    checkContainerSize();
  });

  const checkResizing = () => {
    let isStillResizing = false;

    if (containerRef.current !== null) {
      if (containerRef.current.offsetHeight !== heightRef.current)
        isStillResizing = true;
    }

    if (containerRef.current !== null) {
      if (containerRef.current.offsetWidth !== widthRef.current)
        isStillResizing = true;
    }

    if (isResizingRef.current) {
      if (!isStillResizing)
        setResizing(false);
    }
  };

  const handleWindowResize = (e) => {
    if (!isResizing)
      setResizing(true);

    checkContainerSize();

    window.clearTimeout(resizeTimeoutHandleRef.current);
    resizeTimeoutHandleRef.current = window.setTimeout(checkResizing, 100);
  };

  const checkContainerSize = () => {
    if (containerRef.current === null) return;

    if (containerRef.current.offsetHeight !== height)
      setHeight(containerRef.current.offsetHeight);

    if (containerRef.current.offsetWidth !== width)
      setWidth(containerRef.current.offsetWidth);

    if ((containerRef.current.offsetHeight !== height) || (containerRef.current.offsetWidth !== width)) {
      if (props.onSizeChanged)
        props.onSizeChanged(containerRef.current.offsetHeight, containerRef.current.offsetWidth);
    }
  };

  const renderContent = () => {
    if (containerRef.current === null) return null;

    if ((containerRef.current.offsetHeight !== height) || (containerRef.current.offsetWidth !== width)) {
      return null;
    };

    if (!props.onRenderSizedChild)
      return props.children;

    const showContentOnResize = props.showContentOnResize !== undefined ? props.showContentOnResize : false;

    if (showContentOnResize) {
      return props.onRenderSizedChild(height, width);
    } else {
      if (isResizing)
        return null;

      return props.onRenderSizedChild(height, width);
    }
  };

  // Helpers
  const isScrollLocked = props.isScrollLocked !== undefined ? props.isScrollLocked : false;

  return (
    <Box
      ref={containerRef}
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        ...props.containerStyle
      }}>

      {renderContent()}
    </Box>
  );
};
