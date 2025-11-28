import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const PasswordInput = ({ value, onChange, onAnalyze, isAnalyzing }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.length > 0) {
      onAnalyze();
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password to scan..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="h-14 pl-6 pr-14 text-lg bg-card border-2 border-border focus:border-primary transition-all duration-300 focus:glow-cyber"
          disabled={isAnalyzing}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
        
        {/* Animated underline glow */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ 
            width: value.length > 0 ? '100%' : '0%',
            boxShadow: value.length > 0 ? '0 0 10px hsl(var(--primary))' : 'none'
          }}
        />
      </div>

      <Button
        onClick={onAnalyze}
        disabled={value.length === 0 || isAnalyzing}
        className="w-full h-12 text-base font-['Orbitron'] font-semibold tracking-wide bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-[1.02] hover:glow-cyber disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <Shield className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Defense...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-5 w-5" />
            Scan Password
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        🔒 Your password never leaves this device. Completely private.
      </p>
    </div>
  );
};
