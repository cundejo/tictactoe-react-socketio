import { Box, Grommet, Heading, ResponsiveContext } from 'grommet';
import React from 'react';
import Board from './pages/board';
import * as api from './api';

api.sendMessage('bla')

const theme = {
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: 'Roboto, sans-serif',
      size: '14px',
      height: '20px',
    },
  },
};

const AppBar = (props: any) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="medium"
    style={{ zIndex: '1' }}
    {...props}
  />
);

const App = () => {
  return (
    <Grommet theme={theme} full>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box fill>
            <AppBar>
              <Heading level="2" margin="none">
                Tic Tac Toe
              </Heading>
            </AppBar>
            <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
              <Box flex align="center" justify="center">
                <Board playerX={undefined} playerO={undefined} />
              </Box>
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
};

export default App;
