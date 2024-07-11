'use client'

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [term, setTerm] = useState(searchParams.get('query') || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async (input: string) => {
      if (input.length === 0 || input.length < 3) {
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
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSearch(term);
    }
  }

  function handleSuggestionClick(suggestion: string) {
    setTerm(suggestion);
    setSuggestions([]); // Clear suggestions immediately after selecting a suggestion
    handleSearch(suggestion);
  }

  return (
    <Suspense>
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="Search" className="sr-only">
          Search
        </label>
        <input
          className="w-full px-4 py-2 rounded-md bg-blue-500 text-white placeholder-white border"
          type="text"
          placeholder={placeholder}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {suggestions.length > 0 && (
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
    </Suspense>
  );
}
