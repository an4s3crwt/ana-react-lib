import React from 'react';
import { Box } from '@mui/material';

export const ScrollContainer = (props) => {

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflowX: 'hidden',
        overflowY: props.isScrollLocked ? 'hidden' : 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: (theme) => theme.palette.secondary.main,
        '&::-webkit-scrollbar': {
          width: '0.4rem'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: (theme) => theme.palette.secondary.main
        },
        ...props.contentStyle
      }}>
      {props.children}
    </Box>
  );
};
