
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination } from '@mui/material';
import { format } from 'date-fns';

const History = () => {
  const [rounds, setRounds] = useState([]);
  const [orderBy, setOrderBy] = useState('timestamp');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const q = query(collection(db, "rounds"), orderBy(orderBy, order));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roundsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRounds(roundsData);
    });
    return () => unsubscribe();
  }, [orderBy, order]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedRounds = rounds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'gameName'}
                  direction={orderBy === 'gameName' ? order : 'asc'}
                  onClick={() => handleSort('gameName')}
                >
                  Game
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'betAmount'}
                  direction={orderBy === 'betAmount' ? order : 'asc'}
                  onClick={() => handleSort('betAmount')}
                >
                  Bet
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'actualCashout'}
                  direction={orderBy === 'actualCashout' ? order : 'asc'}
                  onClick={() => handleSort('actualCashout')}
                >
                  Cashout
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'profit'}
                  direction={orderBy === 'profit' ? order : 'asc'}
                  onClick={() => handleSort('profit')}
                >
                  Profit
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'timestamp'}
                  direction={orderBy === 'timestamp' ? order : 'asc'}
                  onClick={() => handleSort('timestamp')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRounds.map((round) => (
              <TableRow key={round.id}>
                <TableCell>{round.gameName}</TableCell>
                <TableCell>${round.betAmount.toFixed(2)}</TableCell>
                <TableCell>{round.actualCashout.toFixed(2)}x</TableCell>
                <TableCell style={{ color: round.profit >= 0 ? 'green' : 'red' }}>
                  {round.profit.toFixed(2)}
                </TableCell>
                <TableCell>{format(round.timestamp.toDate(), 'Pp')}</TableCell>
                <TableCell>{round.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rounds.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default History;
