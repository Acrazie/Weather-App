'use client'

import { useState, useEffect, StrictMode } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [term, setTerm] = useState(searchParams.get('query') || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchSuggestions = async (input: string) => {
      if (input.length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/autocomplete?input=${input}`);
        const data = await response.json();
        setSuggestions(data.predictions.map((prediction: any) => prediction.description));
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    };

    fetchSuggestions(term);
  }, [term]);

  function handleSearch(searchTerm: string) {
    console.log(`Searching... ${searchTerm}`);
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('query', searchTerm);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
    setSuggestions([]); // Clear suggestions on search
    setHighlightedIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (highlightedIndex >= 0) {
        handleSearch(suggestions[highlightedIndex]);
      } else {
        handleSearch(term);
      }
    } else if (event.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  }

  function handleSuggestionClick(suggestion: string) {
    setTerm(suggestion);
    setSuggestions([]); // Clear suggestions immediately after selecting a suggestion
    handleSearch(suggestion);
  }

  return (
    <StrictMode>
      <div className="relative flex flex-1 flex-shrink-0 max-w-md">
        <input
          className="w-full px-4 py-2 rounded-md bg-blue-500 text-white placeholder-white border"
          type="text"
          placeholder={placeholder}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {suggestions.length > 2 && (
          <ul className="absolute top-full left-0 w-full bg-blue-400 border mt-1 rounded-md z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-blue-300"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </StrictMode>
  );
}
