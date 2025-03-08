/** @jsxImportSource @emotion/react */
import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Box, Typography, ListItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AutoSizeContainer } from './../containers';
import { getLogIcon, getLogStyle } from './../../styles';
import { LogLevelEnumeration } from './../loggers';

const LogRenderer = (props) => {

  // Fields
  const listItemSize = 112;

  // External hooks
  const theme = useTheme();

  const getFilteredLogs = () => {
    let filteredLogs = [];
    const minimumFilterLength = props.minimumFilterLength;
    const canFilter = props.filter !== undefined && (minimumFilterLength === undefined || (props.filter.length >= minimumFilterLength));

    if (props.logs) {
      // If no minimal filter length is defined we render all at the beginning
      if (minimumFilterLength === undefined) filteredLogs = props.logs;

      if (canFilter) {
        filteredLogs = props.logs.filter((log) => {
          return log.loggerKey.toLowerCase().includes(props.filter.toLowerCase()) ||
            log.message.toLowerCase().includes(props.filter.toLowerCase());
        });
      }
    }

    return filteredLogs;
  };

  const renderStatus = (log) => {
    const LogIcon = getLogIcon(log);
    const logStyle = getLogStyle(log, theme);

    return (
      <Box
        sx={{
          height: '100%',
          width: 40,
          maxWidth: 40,
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          justifyItems: 'center',
          ...logStyle
        }}
      >
        <LogIcon
          sx={{
            minWidth: 32,
            minHeight: 32
          }}
        />
      </Box>
    );
  };

  const renderRow = (renderProps) => {
    const { index, style } = renderProps;
    const log = filteredLogs[index];

    const timeStampDate = new Date(log.timeStamp);
    const timeStampDateText = `${timeStampDate.toLocaleDateString(props.locale)} ${timeStampDate.getHours()}:${timeStampDate.getMinutes()}:${timeStampDate.getSeconds()}:${timeStampDate.getMilliseconds()}`;

    const infoMessage = `${log.prefix} | ${log.loggerKey} | ${LogLevelEnumeration[log.level]} | ${timeStampDateText}`;

    return (
      <ListItem
        key={index}
        style={{ ...style }}
        sx={{
          maxHeight: listItemSize - 16,
          height: listItemSize - 16,
          padding: 0,
          boxShadow: 5,
          backgroundColor: (theme) => theme.palette.background.paper
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          {renderStatus(log)}

          <Box sx={{ minWidth: theme.spacing(1) }} />

          <Box
            sx={{
              flex: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              justifyItems: 'center'
            }}
          >
            <Typography variant="h6">
              {log.message}
            </Typography>
            <Typography variant="body2">
              {infoMessage}
            </Typography>
          </Box>
        </Box>
      </ListItem>
    );
  };

  // Helpers
  const filteredLogs = getFilteredLogs();

  return (
    <AutoSizeContainer
      onRenderSizedChild={(height, width) => {
        return (
          <FixedSizeList
            css={{
              overflowX: 'hidden',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: theme.palette.secondary.main,
              '&::-webkit-scrollbar': {
                width: '0.4rem'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.secondary.main
              }
            }}
            height={height}
            itemCount={filteredLogs.length}
            itemSize={listItemSize}
            width="100%"
          >
            {renderRow}
          </FixedSizeList>
        );
      }}
    />
  );
};

export default LogRenderer;
