export type Category = 'Productivity' | 'Creative' | 'Coding' | 'Marketing' | 'Business' | 'Education';

export interface PromptPlaceholder {
  id: string;
  label: string;
  type: 'string' | 'dropdown';
  options?: string[];
  defaultValue?: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: Category;
  systemInstruction: string;
  userTemplate: string;
  placeholders: PromptPlaceholder[];
  modelSettings: {
    model: string;
    temperature: number;
    topP: number;
  };
  priceCents: number;
  creator: {
    name: string;
    avatar: string;
  };
  examples: {
    input: Record<string, string>;
    output: string;
  }[];
}

export interface UserLibraryItem {
  promptId: string;
  purchasedAt: string;
}
