import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy as orderByFb } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination, Typography } from '@mui/material';
import { format } from 'date-fns';
const History = () => {
    const [rounds, setRounds] = useState([]);
    const [orderBy, setOrderBy] = useState('timestamp');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const user = auth.currentUser;
    useEffect(() => {
        if (!user)
            return;
        const fetchData = async () => {
            const q = query(collection(db, "users", user.uid, "rounds"), orderByFb(orderBy, order));
            const querySnapshot = await getDocs(q);
            const roundsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRounds(roundsData);
        };
        fetchData();
    }, [user, orderBy, order]);
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
    return (_jsxs(Paper, { children: [_jsx(Typography, { variant: "h6", sx: { p: 2 }, children: "Round History" }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(TableSortLabel, { active: orderBy === 'timestamp', direction: orderBy === 'timestamp' ? order : 'asc', onClick: () => handleSort('timestamp'), children: "Date" }) }), _jsx(TableCell, { children: _jsx(TableSortLabel, { active: orderBy === 'gameName', direction: orderBy === 'gameName' ? order : 'asc', onClick: () => handleSort('gameName'), children: "Game" }) }), _jsx(TableCell, { align: "right", children: _jsx(TableSortLabel, { active: orderBy === 'betAmount', direction: orderBy === 'betAmount' ? order : 'asc', onClick: () => handleSort('betAmount'), children: "Bet" }) }), _jsx(TableCell, { align: "right", children: _jsx(TableSortLabel, { active: orderBy === 'actualCashout', direction: orderBy === 'actualCashout' ? order : 'asc', onClick: () => handleSort('actualCashout'), children: "Cashout" }) }), _jsx(TableCell, { align: "right", children: _jsx(TableSortLabel, { active: orderBy === 'profit', direction: orderBy === 'profit' ? order : 'asc', onClick: () => handleSort('profit'), children: "Profit" }) })] }) }), _jsx(TableBody, { children: sortedRounds.map((round) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: format(round.timestamp.toDate(), 'PPpp') }), _jsx(TableCell, { children: round.gameName }), _jsx(TableCell, { align: "right", children: round.betAmount.toFixed(2) }), _jsxs(TableCell, { align: "right", children: [round.actualCashout.toFixed(2), "x"] }), _jsx(TableCell, { align: "right", style: { color: round.profit >= 0 ? 'green' : 'red' }, children: round.profit.toFixed(2) })] }, round.id))) })] }) }), _jsx(TablePagination, { rowsPerPageOptions: [5, 10, 25], component: "div", count: rounds.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })] }));
};
export default History;
