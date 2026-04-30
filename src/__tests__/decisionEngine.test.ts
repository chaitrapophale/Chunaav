import { calculateDecisionState } from '../utils/decisionEngine';
import { UserProfile, UserDocuments } from '../utils/mockData';

describe('decisionEngine', () => {
  const defaultProfile: UserProfile = {
    age: null,
    location: null,
    language: 'en',
  };

  const defaultDocuments: UserDocuments = {
    aadhaar: false,
    panCard: false,
    voterId: false,
  };

  test('Age < 18 -> NOT eligible', () => {
    const profile = { ...defaultProfile, age: 17 };
    const result = calculateDecisionState(profile, defaultDocuments);
    expect(result.status).toBe('not_eligible');
    expect(result.urgentAction).toBe('notEligible');
    expect(result.readinessScore).toBe(0);
  });

  test('Age >= 18 -> eligible (if has voter ID)', () => {
    const profile = { ...defaultProfile, age: 18 };
    const documents = { ...defaultDocuments, voterId: true, aadhaar: true };
    const result = calculateDecisionState(profile, documents);
    expect(result.status).toBe('eligible');
  });

  test('Aadhaar adds score', () => {
    const profile = { ...defaultProfile, age: 20 };
    const docsNoAadhaar = { ...defaultDocuments, aadhaar: false };
    const docsWithAadhaar = { ...defaultDocuments, aadhaar: true };
    
    const score1 = calculateDecisionState(profile, docsNoAadhaar).readinessScore;
    const score2 = calculateDecisionState(profile, docsWithAadhaar).readinessScore;
    
    expect(score2).toBeGreaterThan(score1);
    expect(score2 - score1).toBe(30); // Base +30 for Aadhaar
  });

  test('Voter ID adds score and changes status', () => {
    const profile = { ...defaultProfile, age: 25 };
    const docsNoVoterId = { ...defaultDocuments, voterId: false };
    const docsWithVoterId = { ...defaultDocuments, voterId: true };
    
    const result1 = calculateDecisionState(profile, docsNoVoterId);
    const result2 = calculateDecisionState(profile, docsWithVoterId);
    
    expect(result2.readinessScore).toBeGreaterThan(result1.readinessScore);
    expect(result1.status).toBe('pending');
    expect(result2.status).toBe('eligible');
  });

  test('Missing documents lowers score / has low score', () => {
    const profile = { ...defaultProfile, age: 30 };
    const result = calculateDecisionState(profile, defaultDocuments);
    
    expect(result.readinessScore).toBe(10); // Only base score
    expect(result.status).toBe('pending');
  });
});
