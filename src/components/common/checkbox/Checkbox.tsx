

interface CheckboxProps {
    label?:string;
    className?: string;
    value: unknown;
    isActive: boolean;
    onChange?: (value: unknown) => void;
}

export function Checkbox({ className, value, onChange,isActive,label }: CheckboxProps) {
    const handleChange = () => {
        if(onChange) {
            onChange(value);
        }
    };

    return (
        <label  className="box-flex gap8">
            <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => handleChange()}
            />
            {label ?? ''}
        </label>

    );
}
