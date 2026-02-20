import { describe, it, expect } from 'vitest';
import {
  normalizeTractorFromSlug,
  normalizeTractor,
} from './normalizeTractor';

describe('normalizeTractorFromSlug', () => {
  it('john-deere-850 => brandName "John Deere", modelName "850"', () => {
    const r = normalizeTractorFromSlug('john-deere-850');
    expect(r.brandName).toBe('John Deere');
    expect(r.modelName).toBe('850');
    expect(r.brandSlug).toBe('john-deere');
    expect(r.modelSlug).toBe('850');
    expect(r.fullName).toBe('John Deere 850');
  });

  it('fendt-206 => brandName "Fendt", modelName "206"', () => {
    const r = normalizeTractorFromSlug('fendt-206');
    expect(r.brandName).toBe('Fendt');
    expect(r.modelName).toBe('206');
    expect(r.brandSlug).toBe('fendt');
    expect(r.modelSlug).toBe('206');
    expect(r.fullName).toBe('Fendt 206');
  });

  it('new-holland-tc24d => brandName "New Holland", modelName "TC24D"', () => {
    const r = normalizeTractorFromSlug('new-holland-tc24d');
    expect(r.brandName).toBe('New Holland');
    expect(r.modelName).toBe('TC24D');
    expect(r.brandSlug).toBe('new-holland');
    expect(r.modelSlug).toBe('tc24d');
    expect(r.fullName).toBe('New Holland TC24D');
  });

  it('caseih-mx200-magnum => brandName "Case IH", modelName "MX200 Magnum"', () => {
    const r = normalizeTractorFromSlug('caseih-mx200-magnum');
    expect(r.brandName).toBe('Case IH');
    expect(r.modelName).toBe('MX200 Magnum');
    expect(r.brandSlug).toBe('caseih');
    expect(r.modelSlug).toBe('mx200-magnum');
    expect(r.fullName).toBe('Case IH MX200 Magnum');
  });

  it('unknown-brand-xyz => fallback brandSlug first token, rest modelSlug', () => {
    const r = normalizeTractorFromSlug('unknown-brand-xyz');
    expect(r.brandSlug).toBe('unknown');
    expect(r.modelSlug).toBe('brand-xyz');
    expect(r.brandName).toBe('Unknown');
    expect(r.modelName).toBe('Brand Xyz');
  });
});

describe('normalizeTractor', () => {
  it('prefers normalized brand/model from slug over raw "John" + "Deere 850"', () => {
    const t = {
      id: 'john-deere-850',
      slug: 'john-deere-850',
      brand: 'John',
      model: 'Deere 850',
    };
    const out = normalizeTractor(t);
    expect(out.normalized.brandName).toBe('John Deere');
    expect(out.normalized.modelName).toBe('850');
    expect(out.normalized.fullName).toBe('John Deere 850');
    expect(out.brand).toBe('John');
    expect(out.model).toBe('Deere 850');
  });
});
