import { describe, it, expect } from 'vitest';
import { fetchQuote } from '../services/quotesApi';

// Simple integration test to verify quote fetching works
describe('Quote Integration Test', () => {
  it('should successfully fetch a quote from the API', async () => {
    const quote = await fetchQuote();
    
    expect(quote).toBeDefined();
    expect(quote.content).toBeDefined();
    expect(typeof quote.content).toBe('string');
    expect(quote.content.length).toBeGreaterThan(0);
    expect(quote.author).toBeDefined();
    expect(typeof quote.author).toBe('string');
  }, 10000); // 10 second timeout for API call

  it('should fetch different quotes on subsequent calls', async () => {
    const quote1 = await fetchQuote();
    const quote2 = await fetchQuote();
    
    expect(quote1).toBeDefined();
    expect(quote2).toBeDefined();
    // Quotes might be the same (random), but both should be valid
    expect(quote1.content).toBeDefined();
    expect(quote2.content).toBeDefined();
  }, 10000);
});
