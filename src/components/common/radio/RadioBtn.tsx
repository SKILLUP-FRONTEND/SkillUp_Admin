interface RadioOption {
    label: string;
    value: unknown;
    groupValue: unknown;
}

interface RadioBtnProps {
    className?: string;
    option: RadioOption;
    onChange?: (value: unknown) => void;
}

export function RadioBtn({className, option,  onChange}: RadioBtnProps) {
    const handleChange = (innerValue : unknown) => {
        if (onChange) {
            onChange(innerValue);
        }
    };

    return (
        <label className={`${className} box-flex gap8 a-center`} style={{cursor: "pointer"}}>
            <input
                type="radio"
                checked={option.value == option.groupValue}
                onChange={(e) => handleChange(option.value)}
            />
            {option.label}
        </label>
    );
}
