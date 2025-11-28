// Password exposure checking using HIBP API
export async function checkPasswordExposure(password: string): Promise<number> {
  try {
    // Hash password with SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const hash = hashHex.toUpperCase();

    // Take first 5 characters
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // Call HIBP API with k-anonymity
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      throw new Error('Failed to check password exposure');
    }

    const text = await response.text();
    const lines = text.split('\n');

    // Check if our suffix exists in the response
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return parseInt(count.trim(), 10);
      }
    }

    return 0; // Not exposed
  } catch (error) {
    console.error('Error checking password exposure:', error);
    return 0; // Fail open - assume not exposed
  }
}

// Calculate pattern score based on predictable patterns
export function calculatePatternScore(password: string): number {
  let score = 0;

  // Sequential keyboard patterns
  const keyboardPatterns = [
    'qwerty', 'asdfgh', 'zxcvbn', '12345', 'qazwsx',
    'qwertyuiop', 'asdfghjkl', 'zxcvbnm'
  ];
  
  const lowerPassword = password.toLowerCase();
  for (const pattern of keyboardPatterns) {
    if (lowerPassword.includes(pattern)) {
      score += 10;
      break;
    }
  }

  // Predictable endings
  const predictableEndings = ['123', '!', '!!!', '@123', '1!', '!1'];
  for (const ending of predictableEndings) {
    if (password.endsWith(ending)) {
      score += 10;
      break;
    }
  }

  // Common passwords (partial list)
  const commonPasswords = [
    'password', 'letmein', 'welcome', 'monkey', 'dragon',
    'master', 'sunshine', 'princess', 'admin', 'login'
  ];
  
  for (const common of commonPasswords) {
    if (lowerPassword.includes(common)) {
      score += 10;
      break;
    }
  }

  return Math.min(score, 30); // Cap at 30
}

// Calculate guessability score
export function calculateGuessabilityScore(password: string): number {
  let score = 0;

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);

  // Only lowercase or very simple
  if (hasLowercase && !hasUppercase && !hasNumbers && !hasSpecialChars) {
    score += 10;
  }

  // Short length
  if (password.length < 8) {
    score += 10;
  }

  return Math.min(score, 20); // Cap at 20
}

// Get exposure score based on times exposed
export function getExposureScore(timesExposed: number): number {
  if (timesExposed === 0) return 0;
  if (timesExposed <= 1000) return 20;
  if (timesExposed <= 10000) return 35;
  if (timesExposed <= 100000) return 50;
  return 60;
}

// Calculate overall strength score
export function calculateStrengthScore(
  timesExposed: number,
  password: string
): number {
  const exposureScore = getExposureScore(timesExposed);
  const patternScore = calculatePatternScore(password);
  const guessabilityScore = calculateGuessabilityScore(password);

  const finalScore = 100 - (exposureScore + patternScore + guessabilityScore);
  return Math.max(0, Math.min(100, finalScore));
}

// Get color based on score
export function getScoreColor(score: number): string {
  if (score <= 25) return '#FF0040'; // danger red
  if (score <= 50) return '#FF7A1A'; // warning orange
  if (score <= 70) return '#00E6FB'; // cyber cyan
  if (score <= 90) return '#11FF6D'; // cyber green
  return '#B300FF'; // electric purple
}

// Get status message based on score
export function getStatusMessage(score: number, timesExposed: number): string {
  if (score === 100) {
    return '🛡 SHIELD ACTIVATED — This password is Sentinel-strong.';
  }
  if (score >= 90) {
    return 'Defense increasing… Strong password detected.';
  }
  if (score >= 70) {
    return 'Moderate defense level. Consider reinforcement.';
  }
  if (score >= 50) {
    return 'Shield compromised — let\'s reinforce it.';
  }
  if (timesExposed > 0) {
    return `⚠️ BREACH DETECTED — Exposed ${timesExposed.toLocaleString()} times.`;
  }
  return 'Weak defense detected. Immediate upgrade recommended.';
}
