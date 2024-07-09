'use client'

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [term, setTerm] = useState(searchParams.get('query') || "");

    function handleSearch() {
        console.log(`Searching... ${term}`);
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        router.replace(`${pathname}?${params.toString()}`);
    }

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    return (
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
                onKeyUp={handleKeyPress}
            />
        </div>
    );
}
