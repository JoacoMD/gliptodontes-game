import { describe, expect, it } from 'vitest';
import {
  LEARN_CATEGORIES,
  LEARN_TOPICS,
  getTopicsByCategory,
} from '@/data/learnTopics';

describe('learnTopics data', () => {
  it('all topic ids are unique', () => {
    const ids = LEARN_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every topic references an existing category', () => {
    const categoryIds = new Set(LEARN_CATEGORIES.map((c) => c.id));
    for (const topic of LEARN_TOPICS) {
      expect(categoryIds.has(topic.categoryId)).toBe(true);
    }
  });

  it('every category has at least one topic', () => {
    for (const category of LEARN_CATEGORIES) {
      expect(getTopicsByCategory(category.id).length).toBeGreaterThan(0);
    }
  });

  it('getTopicsByCategory returns only topics of that category', () => {
    const topics = getTopicsByCategory('megafauna');
    expect(topics.length).toBeGreaterThan(0);
    expect(topics.every((t) => t.categoryId === 'megafauna')).toBe(true);
  });

  it('preserves legacy topic ids used by saved progress', () => {
    const ids = LEARN_TOPICS.map((t) => t.id);
    expect(ids).toContain('que-es-la-paleontologia');
    expect(ids).toContain('que-hacer-al-encontrar-un-fosil');
  });
});
