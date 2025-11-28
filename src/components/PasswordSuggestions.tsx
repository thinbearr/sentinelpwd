import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { PasswordSuggestion } from '@/utils/passwordGenerator';

interface PasswordSuggestionsProps {
  suggestions: PasswordSuggestion[];
}

export const PasswordSuggestions = ({ suggestions }: PasswordSuggestionsProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center gap-2 text-foreground">
        <Sparkles className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-['Orbitron'] font-semibold tracking-wide">
          Reinforced Versions
        </h3>
      </div>

      <div className="grid gap-3">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index}
            className="p-4 bg-card border-2 border-border hover:border-primary transition-all duration-300 group hover:glow-cyber"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="font-mono text-base font-semibold text-foreground break-all">
                  {suggestion.password}
                </div>
                <div className="text-sm text-muted-foreground">
                  {suggestion.description}
                </div>
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(suggestion.password, index)}
                className="shrink-0 hover:text-primary hover:bg-primary/10 transition-all duration-200"
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        These suggestions maintain your original password pattern for better memorability.
      </p>
    </div>
  );
};
