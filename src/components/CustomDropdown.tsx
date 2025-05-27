import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (id: string) => void;
  options: Option[];
  placeholder?: string;
  hasError?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder, hasError }) => {
  const [isOpen, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(opt => opt.id === value);

  return (
    <div 
      className={`custom-dropdown${isOpen ? ' custom-dropdown--open' : ''}${hasError ? ' custom-dropdown--error' : ''}`} 
      ref={dropdownRef}
    >
      <button
        type="button"
        className="custom-dropdown__control"
        onClick={() => setOpen(!isOpen)}
      >
        <span className="custom-dropdown__value">
          {selected ? selected.name : placeholder || 'Выберите группу'}
        </span>
        <ChevronDown className="custom-dropdown__arrow" size={14} />
      </button>
      
      {isOpen && (
        <div className="custom-dropdown__list-container">
          <ul className="custom-dropdown__list">
            {options.map(option => (
              <li
                key={option.id}
                className={`custom-dropdown__option${option.id === value ? ' custom-dropdown__option--selected' : ''}`}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 