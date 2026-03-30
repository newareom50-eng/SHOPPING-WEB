import { Prompt } from './types';

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'The "Deep-Research" Analyst',
    description: 'A high-fidelity research assistant that provides counter-intuitive facts, SWOT analysis, and challenging follow-up questions.',
    category: 'Productivity',
    systemInstruction: 'Act as a Senior Research Lead. Your task is to perform a 3-step analysis on the provided topic. 1. Identify the top 3 counter-intuitive facts. 2. Create a SWOT analysis. 3. Provide 5 challenging further reading questions. Tone: Academic yet accessible.',
    userTemplate: 'Perform a deep research analysis on the topic: [Topic].',
    placeholders: [
      { id: 'Topic', label: 'Research Topic', type: 'string', defaultValue: 'Quantum Computing' }
    ],
    modelSettings: {
      model: 'gemini-3-flash-preview',
      temperature: 0.7,
      topP: 0.95
    },
    priceCents: 499,
    creator: {
      name: 'Alex Rivera',
      avatar: 'https://picsum.photos/seed/alex/100/100'
    },
    examples: [
      {
        input: { Topic: 'Remote Work' },
        output: '### 1. Counter-Intuitive Facts\n- Productivity often increases in remote settings despite fears of slacking.\n- Social isolation can be mitigated by intentional digital "watercoolers".\n- Remote work can actually lead to longer working hours due to blurred boundaries.\n\n### 2. SWOT Analysis\n**Strengths:** Flexibility, reduced overhead.\n**Weaknesses:** Communication lag, isolation.\n**Opportunities:** Global talent pool.\n**Threats:** Security risks, cultural erosion.\n\n### 3. Further Reading\n- How does asynchronous communication affect deep work?'
      }
    ]
  },
  {
    id: '2',
    title: 'Creative World Builder',
    description: 'Generate rich, immersive fictional worlds with deep lore, geography, and cultural nuances.',
    category: 'Creative',
    systemInstruction: 'You are a master world-builder and fantasy novelist. Create a detailed description of a fictional setting based on the user\'s core concept. Focus on sensory details, hidden history, and unique societal rules.',
    userTemplate: 'Build a world based on this concept: [Concept]. The tone should be [Tone].',
    placeholders: [
      { id: 'Concept', label: 'World Concept', type: 'string', defaultValue: 'A city built on the back of a giant turtle' },
      { id: 'Tone', label: 'Narrative Tone', type: 'dropdown', options: ['Dark & Gritty', 'Whimsical', 'Epic', 'Mysterious'], defaultValue: 'Epic' }
    ],
    modelSettings: {
      model: 'gemini-3-flash-preview',
      temperature: 0.9,
      topP: 0.9
    },
    priceCents: 799,
    creator: {
      name: 'Sarah Chen',
      avatar: 'https://picsum.photos/seed/sarah/100/100'
    },
    examples: []
  },
  {
    id: '3',
    title: 'SaaS Marketing Copywriter',
    description: 'Convert features into benefits with high-converting ad copy and landing page headlines.',
    category: 'Marketing',
    systemInstruction: 'You are a world-class direct response copywriter specializing in B2B SaaS. Your goal is to write copy that triggers emotional responses and clear calls to action.',
    userTemplate: 'Write a landing page headline and 3 bullet points for a product called [ProductName] that solves [Problem].',
    placeholders: [
      { id: 'ProductName', label: 'Product Name', type: 'string', defaultValue: 'FlowState' },
      { id: 'Problem', label: 'Main Pain Point', type: 'string', defaultValue: 'Distraction during deep work' }
    ],
    modelSettings: {
      model: 'gemini-3-flash-preview',
      temperature: 0.8,
      topP: 0.95
    },
    priceCents: 599,
    creator: {
      name: 'Marcus Thorne',
      avatar: 'https://picsum.photos/seed/marcus/100/100'
    },
    examples: []
  }
];

export const CATEGORIES: { name: string; icon: string }[] = [
  { name: 'Productivity', icon: 'Zap' },
  { name: 'Creative', icon: 'Palette' },
  { name: 'Coding', icon: 'Code' },
  { name: 'Marketing', icon: 'TrendingUp' },
  { name: 'Business', icon: 'Briefcase' },
  { name: 'Education', icon: 'BookOpen' }
];
