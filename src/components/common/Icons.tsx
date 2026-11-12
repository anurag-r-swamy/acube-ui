import React from 'react';
import {
  Zap,
  Droplets,
  Sparkles,
  Wind,
  Hammer,
  Paintbrush,
  Shield,
  HelpCircle,
  Wrench,
  CheckCircle,
} from 'lucide-react';

export const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Hammer':
      return <Hammer className={className} />;
    case 'Paintbrush':
      return <Paintbrush className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    default:
      return <Wrench className={className} />;
  }
};

