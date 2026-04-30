import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScoreCard } from '../components/ScoreCard';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';

const mockTranslations = {
  voterReadyScore: 'Readiness Score',
  aadhaarLabel: 'Aadhaar Card',
  voterIdLabel: 'Voter ID',
  docChecklist: 'Document Checklist',
  notEligible: 'Not Eligible',
  underageMsg: 'Under 18',
  underageSubMsg: 'Cannot vote yet'
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

describe('ScoreCard Component', () => {
  test('Displays correct percentage', () => {
    const mockContextValue = {
      decisionState: { readinessScore: 75, status: 'pending' },
      documents: { aadhaar: true, voterId: false, drivingLicense: false },
      updateDocuments: jest.fn()
    };

    render(
      <MockProviders contextValue={mockContextValue}>
        <ScoreCard />
      </MockProviders>
    );

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('Updates when state changes (document toggle)', () => {
    const updateDocumentsMock = jest.fn();
    const mockContextValue = {
      decisionState: { readinessScore: 40, status: 'pending' },
      documents: { aadhaar: false, voterId: false, drivingLicense: false },
      updateDocuments: updateDocumentsMock
    };

    render(
      <MockProviders contextValue={mockContextValue}>
        <ScoreCard />
      </MockProviders>
    );

    // Find the Aadhaar toggle
    const aadhaarToggle = screen.getByText('Aadhaar Card');
    fireEvent.click(aadhaarToggle);

    expect(updateDocumentsMock).toHaveBeenCalledWith({ aadhaar: true });
  });

  test('Shows not eligible for under 18', () => {
    const mockContextValue = {
      decisionState: { readinessScore: 0, status: 'not_eligible' },
      documents: { aadhaar: false, voterId: false, drivingLicense: false },
      updateDocuments: jest.fn()
    };

    render(
      <MockProviders contextValue={mockContextValue}>
        <ScoreCard />
      </MockProviders>
    );

    expect(screen.getByText('Not Eligible')).toBeInTheDocument();
    expect(screen.getByText('Under 18')).toBeInTheDocument();
    expect(screen.queryByText('Document Checklist')).not.toBeInTheDocument();
  });
});
