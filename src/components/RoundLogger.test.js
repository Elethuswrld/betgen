import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoundLogger from './RoundLogger';
import { BrowserRouter as Router } from 'react-router-dom';
// Mock Firebase services
vi.mock('../firebase', () => ({
    db: {},
    auth: {
        currentUser: {
            uid: 'test-user'
        }
    }
}));
describe('RoundLogger', () => {
    it('renders without crashing', () => {
        render(_jsx(Router, { children: _jsx(RoundLogger, {}) }));
        expect(screen.getByText('Log a Round')).toBeInTheDocument();
    });
});
