import React from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { UserProvider, UserContext } from '../context/UserContext';

describe('UserContext', () => {
  test('Default state loads', () => {
    let contextValue: any;
    
    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    expect(contextValue).toBeDefined();
    expect(contextValue.profile.age).toBeNull();
    expect(contextValue.documents.voterId).toBe(false);
  });

  test('Manual input updates state', () => {
    let contextValue: any;
    
    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    act(() => {
      contextValue.manualSetup({
        age: 25,
        location: 'Mumbai',
        hasAadhaar: true,
        hasVoterId: true,
      });
    });

    expect(contextValue.profile.age).toBe(25);
    expect(contextValue.profile.location).toBe('Mumbai');
    expect(contextValue.documents.aadhaar).toBe(true);
    expect(contextValue.documents.voterId).toBe(true);
  });

  test('DigiLocker overrides state', () => {
    let contextValue: any;
    
    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    act(() => {
      contextValue.connectDigiLocker();
    });

    expect(contextValue.profile.isConnected).toBe(true);
    expect(contextValue.profile.name).not.toBeNull();
    expect(contextValue.profile.age).toBeGreaterThanOrEqual(18);
    expect(contextValue.documents.aadhaar).toBe(true);
  });
});
