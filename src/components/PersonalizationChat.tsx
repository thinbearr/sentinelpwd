import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, SkipForward } from 'lucide-react';
import { CHAT_QUESTIONS, UserPreferences, ChatQuestion } from '@/utils/passwordGenerator';

interface PersonalizationChatProps {
  onComplete: (preferences: UserPreferences) => void;
}

export const PersonalizationChat = ({ onComplete }: PersonalizationChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const currentQuestion = CHAT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === CHAT_QUESTIONS.length - 1;

  const handleNext = () => {
    if (currentAnswer.trim()) {
      setPreferences(prev => ({
        ...prev,
        [currentQuestion.id]: currentAnswer.trim()
      }));
    }

    if (isLastQuestion) {
      // Complete the chat
      const finalPreferences = currentAnswer.trim() 
        ? { ...preferences, [currentQuestion.id]: currentAnswer.trim() }
        : preferences;
      onComplete(finalPreferences);
      setIsOpen(false);
      // Reset state
      setCurrentQuestionIndex(0);
      setPreferences({});
      setCurrentAnswer('');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      onComplete(preferences);
      setIsOpen(false);
      setCurrentQuestionIndex(0);
      setPreferences({});
      setCurrentAnswer('');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300"
      >
        <MessageCircle className="h-4 w-4" />
        Personalize Suggestions
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-2xl p-6 bg-card border-2 border-primary/50 glow-cyber">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-['Orbitron'] font-semibold text-foreground">
              Let's personalize your suggestions
            </h3>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {CHAT_QUESTIONS.length} • Optional
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
              setCurrentQuestionIndex(0);
              setCurrentAnswer('');
            }}
            className="hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / CHAT_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="space-y-3">
          <p className="text-base font-medium text-foreground">
            {currentQuestion.question}
          </p>
          
          <Input
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentQuestion.placeholder}
            className="h-12 bg-background border-2 border-border focus:border-primary transition-all duration-300"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="gap-2 hover:text-muted-foreground"
          >
            <SkipForward className="h-4 w-4" />
            Skip
          </Button>
          
          <Button
            onClick={handleNext}
            className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
          >
            {isLastQuestion ? 'Complete' : 'Next'}
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground text-center">
          🔒 All answers stay on your device. Cleared on page refresh.
        </p>
      </div>
    </Card>
  );
};
