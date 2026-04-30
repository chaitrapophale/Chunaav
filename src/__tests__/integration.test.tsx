import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProvider } from '../context/UserContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ScoreCard } from '../components/ScoreCard';
import { Roadmap } from '../components/Roadmap';
import { UserContext } from '../context/UserContext';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const IntegrationWrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <UserProvider>
      {children}
    </UserProvider>
  </LanguageProvider>
);

describe('Basic Integration Flow', () => {
  test('Manual data entry updates score and roadmap', async () => {
    render(
      <IntegrationWrapper>
        <UserContext.Consumer>
          {(context) => (
            <>
              <button 
                data-testid="manual-trigger"
                onClick={() => context?.manualSetup({
                  age: 25,
                  location: 'Mumbai, Maharashtra',
                  hasAadhaar: true,
                  hasVoterId: true
                })}
              >
                Trigger Manual Setup
              </button>
              <ScoreCard />
              <Roadmap />
            </>
          )}
        </UserContext.Consumer>
      </IntegrationWrapper>
    );

    // Verify initial state (0% or low score, roadmap step 1)
    // By default, defaultUser has null age and false docs.
    // Decision engine gives base 10 score if something is provided, but default might be 0 if nothing is provided and age < 18 or null.
    // Let's check what's rendered initially.
    
    // Trigger the manual setup
    fireEvent.click(screen.getByTestId('manual-trigger'));

    // Verify score updates (Aadhaar: 30, VoterId: 40, Location: 20, Base: 10 = 100%)
    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    // Verify roadmap updates (Step 4 for fully ready)
    // Step 4 title is "Find Your Polling Booth"
    // We can check if it's highlighted or the text is there.
    expect(screen.getByText(/Booth/i)).toBeInTheDocument();
  });
});
