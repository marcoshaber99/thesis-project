// components/LanguageDropdown.tsx
import React, { useState } from "react";

const languages = [
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  // Add more languages as needed
];

interface LanguageDropdownProps {
  onSelect: (language: string) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ onSelect }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    onSelect(language);
  };

  return (
    <select
      value={selectedLanguage}
      onChange={handleChange}
      className="border border-gray-300 rounded p-2"
    >
      <option value="" disabled>
        Select a language
      </option>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.name}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageDropdown;
