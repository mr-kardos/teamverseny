import { Character } from "../types";
import { Target, X, Lock } from "lucide-react";

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
}

export function CharacterCard({ character, onClick, isSelectable = false, isSelected = false }: CharacterCardProps) {
  const getStatusStyles = () => {
    switch (character.status) {
      case "unavailable":
        return "opacity-40 grayscale";
      case "targetable":
        return "ring-2 ring-amber-500 shadow-lg shadow-amber-500/20";
      case "eliminated":
        return "opacity-60 grayscale";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (character.status) {
      case "targetable":
        return <Target className="w-5 h-5 text-amber-500" />;
      case "eliminated":
        return <X className="w-5 h-5 text-red-600" />;
      case "unavailable":
        return <Lock className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (character.status) {
      case "targetable":
        return "Célpont";
      case "eliminated":
        return `Kiesett ${character.eliminatedDay ? `(${character.eliminatedDay}. nap)` : ""}`;
      case "unavailable":
        return "Zárolva";
      default:
        return "";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-stone-800 rounded-lg overflow-hidden transition-all duration-300
        ${getStatusStyles()}
        ${isSelectable ? "cursor-pointer hover:scale-105" : ""}
        ${isSelected ? "ring-4 ring-green-500" : ""}
      `}
    >
      {/* Character Image */}
      <div className="aspect-square relative">
        <img
          src={character.imageUrl}
          alt={character.name}
          className="w-full h-full object-cover"
        />
        
        {/* Status Overlay for Eliminated */}
        {character.status === "eliminated" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <X className="w-16 h-16 text-red-500" strokeWidth={3} />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full p-2">
          {getStatusIcon()}
        </div>
      </div>

      {/* Character Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-stone-100 mb-1 truncate">
          {character.name}
        </h3>
        <p className="text-xs text-stone-400 truncate">
          {getStatusLabel()}
        </p>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-green-500/20 pointer-events-none flex items-center justify-center">
          <div className="bg-green-500 text-white rounded-full p-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
