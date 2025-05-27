import React, { useRef, useEffect, useState } from 'react';
import IMask from 'imask';
import CustomDropdown from './CustomDropdown';
import { X } from 'lucide-react';

interface GroupOption {
  id: string;
  name: string;
}

interface ContactFormProps {
  onClose: () => void;
  onSave: (data: { name: string; phone: string; group: string }) => void;
  groups: GroupOption[];
  initial?: { name: string; phone: string; group: string };
}

const ContactForm: React.FC<ContactFormProps> = ({ onClose, onSave, groups, initial }) => {
  const phoneRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [group, setGroup] = useState(initial?.group || '');
  const [errors, setErrors] = useState<{name?: string; phone?: string; group?: string}>({});

  useEffect(() => {
    if (phoneRef.current) {
      IMask(phoneRef.current, { mask: '+{7} (000) 000-00-00' });
    }
  }, []);

  const validateForm = () => {
    const newErrors: {name?: string; phone?: string; group?: string} = {};
    
    if (!nameRef.current?.value.trim()) {
      newErrors.name = 'Введите ФИО';
    }
    
    if (!phoneRef.current?.value.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (phoneRef.current?.value.replace(/[^0-9]/g, '').length !== 11) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    
    if (!group) {
      newErrors.group = 'Выберите группу';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameRef.current || !phoneRef.current) return;
    
    if (validateForm()) {
      onSave({
        name: nameRef.current.value.trim(),
        phone: phoneRef.current.value,
        group,
      });
    }
  };

  const handleNameChange = () => {
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handlePhoneChange = () => {
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleGroupChange = (id: string) => {
    setGroup(id);
    if (errors.group) {
      setErrors(prev => ({ ...prev, group: undefined }));
    }
  };

  return (
    <aside className="contact-form">
      <div className="contact-form__header">
        <span className="contact-form__title">{initial ? 'Редактирование контакта' : 'Добавление контакта'}</span>
        <button className="contact-form__close" onClick={onClose} aria-label="Закрыть">
          <X size={24} />
        </button>
      </div>
      <form className="contact-form__body" onSubmit={handleSubmit}>
        <div className="contact-form__field">
          <input 
            className={`contact-form__input ${errors.name ? 'contact-form__input--error' : ''}`}
            placeholder="Введите ФИО" 
            defaultValue={initial?.name} 
            ref={nameRef}
            onChange={handleNameChange}
          />
          {errors.name && <span className="contact-form__error">{errors.name}</span>}
        </div>
        
        <div className="contact-form__field">
          <input 
            className={`contact-form__input ${errors.phone ? 'contact-form__input--error' : ''}`}
            placeholder="Введите номер" 
            ref={phoneRef}
            defaultValue={initial?.phone}
            onChange={handlePhoneChange}
          />
          {errors.phone && <span className="contact-form__error">{errors.phone}</span>}
        </div>
        
        <div className="contact-form__field">
          <CustomDropdown
            value={group}
            onChange={handleGroupChange}
            options={groups}
            placeholder="Выберите группу"
            hasError={!!errors.group}
          />
          {errors.group && <span className="contact-form__error">{errors.group}</span>}
        </div>
        
        <button className="contact-form__save" type="submit">Сохранить</button>
      </form>
    </aside>
  );
};

export default ContactForm; 