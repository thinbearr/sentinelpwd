import { useEffect, useState } from 'react';
import { getScoreColor } from '@/utils/passwordChecker';

interface SpeedometerGaugeProps {
  score: number;
  isAnalyzing?: boolean;
}

export const SpeedometerGauge = ({ score, isAnalyzing }: SpeedometerGaugeProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showDefenseBoost, setShowDefenseBoost] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);

  useEffect(() => {
    // Animate score change
    const duration = 800;
    const steps = 60;
    const increment = (score - displayScore) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayScore(score);
        clearInterval(timer);
        
        // Show defense boost animation if score increased
        if (score > previousScore && previousScore > 0) {
          setShowDefenseBoost(true);
          setTimeout(() => setShowDefenseBoost(false), 1000);
        }
        setPreviousScore(score);
      } else {
        setDisplayScore(prev => prev + increment);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Semi-circle arc parameters
  const radius = 120;
  const strokeWidth = 20;
  const center = 150;
  const circumference = Math.PI * radius; // Half circle
  const offset = circumference - (displayScore / 100) * circumference;
  
  const color = getScoreColor(score);
  const isPerfect = score === 100;

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Speedometer */}
      <svg width="300" height="180" className="transform">
        {/* Background arc */}
        <path
          d={`M 30 ${center} A ${radius} ${radius} 0 0 1 ${300 - 30} ${center}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Animated score arc */}
        <path
          d={`M 30 ${center} A ${radius} ${radius} 0 0 1 ${300 - 30} ${center}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-700 ease-out ${isPerfect ? 'animate-pulse-glow' : ''}`}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`
          }}
        />

        {/* Center needle (optional visual enhancement) */}
        <line
          x1={center}
          y1={center}
          x2={center + Math.cos((Math.PI * (1 - displayScore / 100))) * (radius - 10)}
          y2={center - Math.sin((Math.PI * (1 - displayScore / 100))) * (radius - 10)}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 4px ${color})`
          }}
        />
      </svg>

      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <div className="text-6xl font-bold font-['Orbitron'] tracking-wider" style={{ color }}>
          {Math.round(displayScore)}
        </div>
        <div className="text-sm text-muted-foreground mt-1 font-['Orbitron'] tracking-wide">
          DEFENSE LEVEL
        </div>
        
        {isAnalyzing && (
          <div className="absolute -bottom-4 text-xs text-primary animate-pulse">
            Scanning...
          </div>
        )}

        {isPerfect && (
          <div className="absolute -bottom-6 text-xs text-secondary font-['Orbitron'] animate-pulse-glow">
            SHIELD ACTIVATED
          </div>
        )}
      </div>

      {/* Defense boost notification */}
      {showDefenseBoost && (
        <div 
          className="absolute top-0 text-success font-bold text-xl font-['Orbitron'] animate-float-up"
          style={{ textShadow: '0 0 10px currentColor' }}
        >
          +{Math.round(score - previousScore)} DEFENSE
        </div>
      )}
    </div>
  );
};
