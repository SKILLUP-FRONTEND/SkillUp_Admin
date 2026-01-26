// src/components/common/dropdown/Dropdown.tsx

/* 
  담당자 : 김은혜
  최초 작성일 : 2025-09-16
  최종 수정일 : 2025-09-16
*/

import {useState, useRef, useEffect} from "react";
import styles from "./Dropdown.module.css";
import Image from "next/image";
import ChevronDownIcon from "@/assets/chevron_down.svg";

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    label?: string;
    id?: string;
    dropdownPosition?: "top" | "bottom";
}

export default function Dropdown({
                                     options,
                                     value,
                                     onChange,
                                     placeholder = "선택해주세요",
                                     disabled = false,
                                     className = "",
                                     label,
                                     id,
                                 }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || placeholder;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className={styles.dropdown}>
            <button
                id={id}
                disabled={disabled}
                onClick={() => setIsOpen((prev) => !prev)}
                className={styles.btnDropdown}
            >
                <span className={styles.textDropDownLabel}>{selectedLabel}</span>
                <Image src={ChevronDownIcon} alt="chevron down" width={12} height={12}/>
            </button>

            {isOpen && (
                <ul className={styles.dropdownList}>
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            className={styles.dropdownItem}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
