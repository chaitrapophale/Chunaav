import { getGeminiResponse } from '../utils/gemini';

// Mock the environment to test fallback
const originalEnv = process.env;

describe('gemini', () => {
  beforeEach(() => {
    jest.resetModules(); // clears the cache
    process.env = { ...originalEnv }; // make a copy
  });

  afterAll(() => {
    process.env = originalEnv; // restore original env
  });

  test('API fallback works without key', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = '';
    
    // Use an English prompt and test fallback
    const response = await getGeminiResponse('How to register?', '', 'en');
    
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.toLowerCase()).toContain('to vote, you need to register first');
  });

  test('Returns response for generic questions', async () => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = '';
    
    const response = await getGeminiResponse('am I eligible to vote', '', 'en');
    
    expect(response).toBeDefined();
    expect(response.toLowerCase()).toContain('must be an indian citizen');
  });

  test('Does not crash on error (falls back)', async () => {
    // If the API key is present but invalid/errors out, it should fall back.
    // Testing the catch block indirectly by checking that without a key it uses fallback.
    // Even if it throws, the code catches it and returns a string.
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'invalid-key';
    
    // getGeminiResponse handles the error and uses generateSmartFallback
    const response = await getGeminiResponse('invalid question', '', 'en');
    
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
  });
});
