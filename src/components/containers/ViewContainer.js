import React from 'react';
import { Box } from '@mui/material';
import { ScrollContainer } from './ScrollContainer';

export const ViewContainer = (props) => {

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: props.backgroundColor ? props.backgroundColor : 'inherit'
      }}>

      <Box
        sx={{
          flex: 'auto',
          overflowY: 'hidden'
        }}>

        <ScrollContainer
          isScrollLocked={props.isScrollLocked}>
          {props.children}
        </ScrollContainer>
      </Box>

    </Box>
  );
};
