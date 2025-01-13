import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import * as mediaQuery from '@/hooks/useMediaQuery';

// Mock the hooks and components
jest.mock('@/hooks/useMediaQuery');
jest.mock('./NavigationMenu', () => ({
  NavigationMenu: () => <div data-testid="navigation-menu">Navigation Menu</div>
}));
jest.mock('./Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>
}));

describe('RootLayout', () => {
  const renderWithRouter = (children: React.ReactNode = 'Test Content') => {
    return render(
      <BrowserRouter>
        <RootLayout>{children}</RootLayout>
      </BrowserRouter>
    );
  };

  describe('Mobile View', () => {
    beforeEach(() => {
      (mediaQuery.useMediaQuery as jest.Mock).mockReturnValue(true); // isMobile = true
    });

    it('renders mobile layout correctly', () => {
      renderWithRouter();
      
      // Should show mobile header with sidebar
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      
      // Should not show desktop navigation
      expect(screen.queryByTestId('navigation-menu')).not.toBeInTheDocument();
      
      // Should render children
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      (mediaQuery.useMediaQuery as jest.Mock).mockReturnValue(false); // isMobile = false
    });

    it('renders desktop layout correctly', () => {
      renderWithRouter();
      
      // Should show both sidebar and navigation menu
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-menu')).toBeInTheDocument();
      
      // Should render children
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });
}); 