import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SpeedometerGauge } from '@/components/SpeedometerGauge';
import { PasswordInput } from '@/components/PasswordInput';
import { PasswordSuggestions } from '@/components/PasswordSuggestions';
import { PersonalizationChat } from '@/components/PersonalizationChat';
import { 
  checkPasswordExposure, 
  calculateStrengthScore, 
  getStatusMessage 
} from '@/utils/passwordChecker';
import { 
  generatePasswordSuggestions, 
  PasswordSuggestion, 
  UserPreferences 
} from '@/utils/passwordGenerator';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [timesExposed, setTimesExposed] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [suggestions, setSuggestions] = useState<PasswordSuggestion[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});

  const analyzePassword = async () => {
    if (password.length === 0) return;

    setIsAnalyzing(true);
    setHasAnalyzed(false);

    try {
      // Check exposure
      const exposed = await checkPasswordExposure(password);
      setTimesExposed(exposed);

      // Calculate score
      const calculatedScore = calculateStrengthScore(exposed, password);
      setScore(calculatedScore);

      // Set status message
      const message = getStatusMessage(calculatedScore, exposed);
      setStatusMessage(message);

      // Generate suggestions
      const newSuggestions = generatePasswordSuggestions(password, userPreferences);
      setSuggestions(newSuggestions);

      setHasAnalyzed(true);
    } catch (error) {
      console.error('Analysis error:', error);
      setStatusMessage('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePersonalizationComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    if (hasAnalyzed) {
      // Regenerate suggestions with new preferences
      const newSuggestions = generatePasswordSuggestions(password, preferences);
      setSuggestions(newSuggestions);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-4 md:p-8 overflow-x-hidden">
      {/* Header */}
      <header className="w-full max-w-6xl mb-12 mt-8">
        <div className="flex items-center gap-3 justify-center mb-3">
          <Shield className="h-10 w-10 text-primary glow-cyber" />
          <h1 className="text-5xl md:text-6xl font-['Orbitron'] font-black tracking-tight text-gradient-cyber">
            SENTINEL
          </h1>
        </div>
        <p className="text-center text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Your cyber guardian for password security. Scan exposure, measure strength, get reinforced suggestions.
        </p>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-6xl space-y-8 flex flex-col items-center">
        {/* Password Input Section */}
        <PasswordInput
          value={password}
          onChange={setPassword}
          onAnalyze={analyzePassword}
          isAnalyzing={isAnalyzing}
        />

        {/* Results Section */}
        {hasAnalyzed && (
          <>
            {/* Speedometer */}
            <Card className="p-8 bg-card border-2 border-border hover:border-primary/50 transition-all duration-300">
              <SpeedometerGauge score={score} isAnalyzing={isAnalyzing} />
            </Card>

            {/* Status Message */}
            <Card className={`w-full max-w-2xl p-6 border-2 transition-all duration-300 ${
              score === 100 
                ? 'border-secondary bg-secondary/5 glow-purple' 
                : score >= 70 
                ? 'border-primary bg-primary/5' 
                : 'border-warning bg-warning/5'
            }`}>
              <div className="flex items-start gap-4">
                {score === 100 ? (
                  <CheckCircle2 className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                ) : score >= 50 ? (
                  <AlertTriangle className="h-6 w-6 text-warning shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <p className="text-base font-['Orbitron'] font-semibold text-foreground">
                    {statusMessage}
                  </p>
                  {timesExposed > 0 && (
                    <p className="text-sm text-muted-foreground">
                      This password has been found in {timesExposed.toLocaleString()} data breaches. 
                      Consider using one of the reinforced suggestions below.
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Personalization Chat */}
            {suggestions.length > 0 && (
              <div className="flex justify-center">
                <PersonalizationChat onComplete={handlePersonalizationComplete} />
              </div>
            )}

            {/* Suggestions */}
            <PasswordSuggestions suggestions={suggestions} />
          </>
        )}

        {/* Info Cards (when not analyzed yet) */}
        {!hasAnalyzed && (
          <div className="grid md:grid-cols-3 gap-4 w-full max-w-4xl mt-12">
            <Card className="p-6 bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:glow-cyber">
              <div className="space-y-2">
                <div className="text-primary text-2xl">🔍</div>
                <h3 className="font-['Orbitron'] font-semibold text-foreground">
                  Exposure Detection
                </h3>
                <p className="text-sm text-muted-foreground">
                  Scans if your password appeared in data breaches using HIBP API
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:glow-cyber">
              <div className="space-y-2">
                <div className="text-primary text-2xl">⚡</div>
                <h3 className="font-['Orbitron'] font-semibold text-foreground">
                  True Strength
                </h3>
                <p className="text-sm text-muted-foreground">
                  Measures security based on exposure, patterns, and guessability
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:glow-cyber">
              <div className="space-y-2">
                <div className="text-primary text-2xl">🛡️</div>
                <h3 className="font-['Orbitron'] font-semibold text-foreground">
                  Smart Upgrades
                </h3>
                <p className="text-sm text-muted-foreground">
                  Suggests stronger versions that preserve your password pattern
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mt-16 mb-8 text-center text-xs text-muted-foreground">
        <p>
          Sentinel by Lovable • All processing happens locally • Your password never leaves your device
        </p>
      </footer>
    </div>
  );
};

export default Index;
