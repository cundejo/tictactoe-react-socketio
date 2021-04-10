import React, { FC, useState } from 'react';
import { Box, Button, Heading, Text } from 'grommet';

export type Value = 'X' | 'O' | '';
export type Player = 'X' | 'O';

export type Status = {
  finished: boolean;
  winner?: string;
  winnerLine?: number[];
};

type TileProps = {
  value: Value;
  onClick: (e: any) => void;
  status: Status;
};

export const checkStatus = (values: Value[]): Status => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let winner;
  let winnerLine;
  lines.some((line) => {
    if (values[line[0]] === values[line[1]] && values[line[1]] === values[line[2]]) {
      winner = values[line[0]];
      winnerLine = line;
      return true;
    }
    return false;
  });

  if (winner) return { finished: true, winner, winnerLine };

  if (values.every((value) => value !== '')) {
    return { finished: true };
  }

  return { finished: false };
};

const Tile: FC<TileProps> = ({ value, onClick, status }) => (
  <Box basis="1/3" height="30vw">
    <Button
      secondary
      label={<Text size="xxlarge">{value}</Text>}
      onClick={onClick}
      disabled={status.finished}
      fill={'vertical'}
      margin="small"
    />
  </Box>
);

type HeaderProps = {
  currentPlayer: Player;
  status: Status;
};

const Status: FC<HeaderProps> = ({ currentPlayer, status }) => {
  let statusText;
  if (!status.finished) statusText = `${currentPlayer} player turn`;
  if (status.finished && status.winner) statusText = `Game finished, player ${status.winner} is the winner!`;
  if (!statusText) statusText = `Game finished in draw`;
  return (
    <Box width="80vw">
      <Heading level="2" textAlign="center">
        {statusText}
      </Heading>
    </Box>
  );
};

type BoardProps = {
  playerX?: string;
  playerO?: string;
};

const Board: FC<BoardProps> = ({ playerX, playerO }) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [values, setValues] = useState<Value[]>(['', '', '', '', '', '', '', '', '']);

  const handleClick = (position: number) => {
    if (values[position]) return;
    const newValues = [...values];
    newValues[position] = currentPlayer;
    setValues(newValues);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const status = checkStatus(values);

  return (
    <>
      <Status currentPlayer={currentPlayer} status={status} />
      <Box wrap direction="row" width="90vw" height="90vw">
        {values.map((value, position) => (
          <Tile key={position} value={value} onClick={() => handleClick(position)} status={status} />
        ))}
      </Box>
    </>
  );
};

export default Board;
