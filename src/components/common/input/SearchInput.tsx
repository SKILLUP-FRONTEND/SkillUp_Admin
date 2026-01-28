// src/components/common/input/SearchInput.tsx
"use client";

import styles from "./SearchInput.module.css";
import { useState } from "react";

interface SearchInputProps {
    onSearch?: (keyword: string) => void;
    initialValue?: string;
}

export default function SearchInput({ initialValue,onSearch }: SearchInputProps) {
    const [value, setValue] = useState(initialValue ?? '');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch?.(value.trim());
        }
    };

    return (
        <div className={styles.searchInputWrapper}>
            <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
