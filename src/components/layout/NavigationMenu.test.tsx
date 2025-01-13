import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NavigationMenu } from './NavigationMenu';

describe('NavigationMenu', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <NavigationMenu />
      </BrowserRouter>
    );
  };

  it('renders all navigation items', () => {
    renderWithRouter();
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Budget')).toBeInTheDocument();
    expect(screen.getByText('Bill Reminders')).toBeInTheDocument();
    expect(screen.getByText('Revolut Import')).toBeInTheDocument();
  });

  it('renders the app title', () => {
    renderWithRouter();
    expect(screen.getByText('MyBudget')).toBeInTheDocument();
  });

  it('renders all navigation links with correct hrefs', () => {
    renderWithRouter();
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /create budget/i })).toHaveAttribute('href', '/create-budget');
    expect(screen.getByRole('link', { name: /bill reminders/i })).toHaveAttribute('href', '/bill-reminders');
    expect(screen.getByRole('link', { name: /revolut import/i })).toHaveAttribute('href', '/revolut-import');
  });
}); 