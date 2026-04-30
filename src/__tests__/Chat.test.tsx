import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Chat } from '../components/Chat';
import { UserContext } from '../context/UserContext';
import { LanguageContext } from '../context/LanguageContext';
import { getGeminiResponse } from '../utils/gemini';
import { defaultUser } from '../utils/mockData';

// Mock gemini api
jest.mock('../utils/gemini', () => ({
  getGeminiResponse: jest.fn(),
}));

const mockTranslations = {
  assistantGreeting: 'Hello! I am Chunaav AI.',
  aiSubtitle: 'AI Assistant',
  aiGreetingConnected: 'Hi {name} 👋',
  aiGreetingManual: 'Got it! 👋 Based on your details...',
  errorGeneric: 'Hmm, I couldn\'t process that.',
  chatPlaceholder: 'Ask about voting...'
};

const MockProviders = ({ children }: { children: React.ReactNode }) => {
  const userContextValue: any = {
    profile: defaultUser.profile,
    documents: defaultUser.documents,
    decisionState: { aiContext: 'mock context' },
  };

  const languageContextValue: any = {
    language: 'en',
    t: mockTranslations,
  };

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <UserContext.Provider value={userContextValue}>
        {children}
      </UserContext.Provider>
    </LanguageContext.Provider>
  );
};

describe('Chat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Rrenders input box and initial message', () => {
    render(
      <MockProviders>
        <Chat />
      </MockProviders>
    );

    expect(screen.getByText('Hello! I am Chunaav AI.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask about voting...')).toBeInTheDocument();
  });

  test('Sends message and displays response', async () => {
    const mockResponse = 'Here is the mock response from AI.';
    (getGeminiResponse as jest.Mock).mockResolvedValue(mockResponse);

    render(
      <MockProviders>
        <Chat />
      </MockProviders>
    );

    const input = screen.getByPlaceholderText('Ask about voting...');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'How to vote?' } });
    fireEvent.click(sendButton);

    // Verify user message appears immediately
    expect(screen.getByText('How to vote?')).toBeInTheDocument();

    // Verify loading state
    // (mock api is asynchronous so there is a small delay)
    
    // Verify bot response appears after API call resolves
    await waitFor(() => {
      expect(screen.getByText(mockResponse)).toBeInTheDocument();
    });
  });
});
