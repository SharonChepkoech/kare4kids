import React from "react";

interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    value: string | number;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    textarea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, placeholder, onChange, textarea }) => {
    return (
        <div>
            <label className="block text-sm text-cyan-500 font-medium">{label}:</label>
            {textarea ? (
                <textarea
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="w-full p-2 border border-cyan-500 rounded-md text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="w-full p-2 border border-cyan-500 rounded-md text-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition"
                />
            )}
        </div>
    );
};

export default InputField;
