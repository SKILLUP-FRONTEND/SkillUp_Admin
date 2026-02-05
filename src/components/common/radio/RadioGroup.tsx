interface RadioOption {
    label: string;
    value: unknown;
}

interface RadioGroupProps {
    className?: string;
    options: RadioOption[];
    value: unknown;
    onChange?: (value: unknown) => void;
}

export function RadioGroup({className, options, value, onChange}: RadioGroupProps) {
    const handleChange = (innerValue : unknown) => {
        if (onChange) {
            onChange(innerValue);
        }
    };

    return (
        <div className={`${className} box-flex gap24 fw-wrap`}>
            {options.map((opt,index) => (
                <label key={index} className="box-flex gap8 a-center" style={{cursor: "pointer"}}>
                    <input
                        type="radio"
                        checked={value == opt.value}
                        onChange={(e) => handleChange(opt.value)}
                    />
                    {opt.label}
                </label>

            ))}
        </div>
    );
}
