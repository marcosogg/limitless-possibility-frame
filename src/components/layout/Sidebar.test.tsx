import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import * as mediaQuery from '@/hooks/useMediaQuery';
import * as sidebarState from '@/hooks/useSidebarState';

// Mock the hooks
jest.mock('@/hooks/useMediaQuery');
jest.mock('@/hooks/useSidebarState');

describe('Sidebar', () => {
  const mockUseSidebarState = {
    isOpen: false,
    isExpanded: true,
    setOpen: jest.fn(),
    toggleExpanded: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (sidebarState.useSidebarState as jest.Mock).mockReturnValue(mockUseSidebarState);
  });

  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
  };

  describe('Mobile View', () => {
    beforeEach(() => {
      (mediaQuery.useMediaQuery as jest.Mock).mockReturnValue(true); // isMobile = true
    });

    it('renders mobile menu button', () => {
      renderWithRouter();
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    it('opens sheet when menu button is clicked', () => {
      renderWithRouter();
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);
      expect(mockUseSidebarState.setOpen).toHaveBeenCalledWith(true);
    });
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      (mediaQuery.useMediaQuery as jest.Mock).mockReturnValue(false); // isMobile = false
    });

    it('renders desktop sidebar with navigation items', () => {
      renderWithRouter();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Create Budget')).toBeInTheDocument();
      expect(screen.getByText('Bill Reminders')).toBeInTheDocument();
      expect(screen.getByText('Revolut Import')).toBeInTheDocument();
    });

    it('toggles sidebar expansion when toggle button is clicked', () => {
      renderWithRouter();
      const toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);
      expect(mockUseSidebarState.toggleExpanded).toHaveBeenCalled();
    });

    it('hides labels when sidebar is collapsed', () => {
      (sidebarState.useSidebarState as jest.Mock).mockReturnValue({
        ...mockUseSidebarState,
        isExpanded: false,
      });
      renderWithRouter();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });
  });
}); 