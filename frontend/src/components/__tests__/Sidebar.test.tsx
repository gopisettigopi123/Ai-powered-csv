import { render, screen } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { vi, describe, it, expect } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/manage-leads'
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() })
}));

describe('Sidebar Component', () => {
  it('renders the sidebar navigation items', () => {
    render(<Sidebar />);
    
    // Check if main links exist
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Lead Sources')).toBeInTheDocument();
    expect(screen.getByText('Manage Leads')).toBeInTheDocument();
  });
});
