// Generate password suggestions that preserve original pattern
export interface PasswordSuggestion {
  password: string;
  description: string;
}

export interface UserPreferences {
  nickname?: string;
  idol?: string;
  hobby?: string;
  pet?: string;
  place?: string;
  style?: 'simple' | 'stylish' | 'futuristic';
  symbol?: string;
}

const COMMON_SYMBOLS = ['_', '-', '@', '#', '!', '~', '*'];
const POPULAR_SUFFIXES = [
  'Dragon', 'Phoenix', 'Storm', 'Nova', 'Ace',
  'Alpha', 'Cyber', 'Nexus', 'Orbit', 'Pixel'
];

// Extract core characters from password (letters and numbers)
function extractCore(password: string): { core: string; numbers: string } {
  const letters = password.match(/[a-zA-Z]+/g)?.join('') || '';
  const numbers = password.match(/\d+/g)?.join('') || '';
  return { core: letters, numbers };
}

// Capitalize strategically
function strategicCapitalize(str: string): string {
  if (!str) return str;
  const length = str.length;
  
  if (length <= 2) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Capitalize first, middle, and random positions
  let result = str.split('');
  result[0] = result[0].toUpperCase();
  
  if (length > 3) {
    const midPoint = Math.floor(length / 2);
    result[midPoint] = result[midPoint].toUpperCase();
  }
  
  return result.join('');
}

// Generate suggestions based on user preferences
export function generatePasswordSuggestions(
  originalPassword: string,
  preferences: UserPreferences = {}
): PasswordSuggestion[] {
  const { core, numbers } = extractCore(originalPassword);
  const suggestions: PasswordSuggestion[] = [];
  
  // Get preferred symbol or use default
  const symbol = preferences.symbol || COMMON_SYMBOLS[Math.floor(Math.random() * COMMON_SYMBOLS.length)];
  
  // Suggestion 1: Strategic capitalization + symbol + suffix from preference
  const suffix1 = preferences.idol || preferences.hobby || POPULAR_SUFFIXES[0];
  const enhanced1 = strategicCapitalize(core) + (numbers ? symbol + numbers : '') + symbol + suffix1;
  suggestions.push({
    password: enhanced1,
    description: preferences.idol ? `With your idol: ${preferences.idol}` : 
                 preferences.hobby ? `Themed around: ${preferences.hobby}` : 
                 'Enhanced with strong suffix'
  });

  // Suggestion 2: Symbol interruption + nickname or place
  const suffix2 = preferences.nickname || preferences.place || POPULAR_SUFFIXES[1];
  const chars = core.split('');
  if (chars.length > 2) {
    const midPoint = Math.floor(chars.length / 2);
    chars.splice(midPoint, 0, symbol);
  }
  const enhanced2 = strategicCapitalize(chars.join('')) + (numbers ? symbol + numbers : '') + '_' + suffix2;
  suggestions.push({
    password: enhanced2,
    description: preferences.nickname ? `Your nickname added: ${preferences.nickname}` : 
                 preferences.place ? `Location-based: ${preferences.place}` : 
                 'Mid-pattern reinforcement'
  });

  // Suggestion 3: Style-based generation
  let enhanced3 = '';
  if (preferences.style === 'futuristic') {
    enhanced3 = core.toUpperCase() + (numbers ? '@' + numbers : '') + '>' + (preferences.pet || 'Cyber');
  } else if (preferences.style === 'stylish') {
    enhanced3 = strategicCapitalize(core) + (numbers ? '~' + numbers : '') + '*' + (preferences.hobby || POPULAR_SUFFIXES[2]);
  } else {
    // Simple but strong
    enhanced3 = strategicCapitalize(core) + (numbers ? '_' + numbers : '') + '!' + (POPULAR_SUFFIXES[3]);
  }
  
  suggestions.push({
    password: enhanced3,
    description: preferences.style ? `${preferences.style.charAt(0).toUpperCase() + preferences.style.slice(1)} style` : 
                 'Balanced strength'
  });

  return suggestions;
}

// Chatbot questions for personalization
export interface ChatQuestion {
  id: string;
  question: string;
  placeholder: string;
}

export const CHAT_QUESTIONS: ChatQuestion[] = [
  {
    id: 'nickname',
    question: 'Got a nickname you like?',
    placeholder: 'e.g., Storm, Ace, Phoenix'
  },
  {
    id: 'idol',
    question: 'Any idol, character, or celebrity you admire?',
    placeholder: 'e.g., Naruto, Tesla, Stark'
  },
  {
    id: 'hobby',
    question: 'What\'s your hobby or passion?',
    placeholder: 'e.g., Gaming, Travel, Music'
  },
  {
    id: 'pet',
    question: 'Pet or favorite animal name?',
    placeholder: 'e.g., Luna, Tiger, Shadow'
  },
  {
    id: 'place',
    question: 'City, college, or place close to your heart?',
    placeholder: 'e.g., Tokyo, MIT, HomeBase'
  },
  {
    id: 'style',
    question: 'Preferred password style?',
    placeholder: 'Simple / Stylish / Futuristic'
  },
  {
    id: 'symbol',
    question: 'Favorite symbol to use?',
    placeholder: '_ - @ # ! ~ *'
  }
];
