import React from 'react';
import { render, screen } from '@testing-library/react';
import { Roadmap } from '../components/Roadmap';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';

const mockTranslations = {
  roadmap: {
    checkEligibility: { title: 'Eligibility', desc: 'Desc 1' },
    applyVoterId: { title: 'Voter ID', desc: 'Desc 2' },
    verifyDetails: { title: 'Verify', desc: 'Desc 3' },
    findPollingBooth: { title: 'Booth', desc: 'Desc 4' },
    vote: { title: 'Vote', desc: 'Desc 5' }
  },
  yourVotingJourney: 'Your Journey',
  underageRoadmap: 'You are under 18',
  pendingStatus: 'Pending',
  takeAction: 'Take Action',
  applyOnNvsp: 'Apply'
};

const MockProviders = ({ children, contextValue }: any) => {
  const languageContextValue: any = {
    language: 'en',
    t: mockTranslations,
  };

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    </LanguageContext.Provider>
  );
};

describe('Roadmap Component', () => {
  test('Shows all steps', () => {
    const mockContextValue = {
      decisionState: { roadmapStep: 1, status: 'pending' },
      documents: { aadhaar: true, voterId: false },
    };

    render(
      <MockProviders contextValue={mockContextValue}>
        <Roadmap />
      </MockProviders>
    );

    expect(screen.getByText('Eligibility')).toBeInTheDocument();
    expect(screen.getByText('Voter ID')).toBeInTheDocument();
    expect(screen.getByText('Verify')).toBeInTheDocument();
    expect(screen.getByText('Booth')).toBeInTheDocument();
    expect(screen.getByText('Vote')).toBeInTheDocument();
  });

  test('Shows blocked roadmap for under 18', () => {
    const mockContextValue = {
      decisionState: { roadmapStep: 0, status: 'not_eligible' },
      documents: { aadhaar: true, voterId: false },
    };

    render(
      <MockProviders contextValue={mockContextValue}>
        <Roadmap />
      </MockProviders>
    );

    expect(screen.getByText('You are under 18')).toBeInTheDocument();
  });
});
