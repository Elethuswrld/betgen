import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './themes';
import { ThemeContext } from './ThemeContext';
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });
    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(isDarkMode));
    }, [isDarkMode]);
    const toggleTheme = useCallback(() => {
        setIsDarkMode(prevMode => !prevMode);
    }, []);
    const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);
    const contextValue = useMemo(() => ({ toggleTheme, isDarkMode }), [toggleTheme, isDarkMode]);
    return (_jsx(ThemeContext.Provider, { value: contextValue, children: _jsx(MuiThemeProvider, { theme: theme, children: children }) }));
};
