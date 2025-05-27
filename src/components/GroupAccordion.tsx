import React, { useState } from 'react';
import { Contact } from '../models/Contact';
import { Group } from '../models/Group';
import { ChevronDown } from 'lucide-react';

import blackPencilIcon from '../assets/Mode edit.svg';
import blackDeleteIcon from '../assets/Delete forever.svg';

interface Props {
  group: Group;
  contacts: Contact[];
  defaultOpen?: boolean;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

const GroupAccordion: React.FC<Props> = ({ group, contacts, defaultOpen, onEdit, onDelete }) => {
  const [isOpen, setOpen] = useState(defaultOpen);

  return (
    <div className="group-accordion">
      <button 
        className="group-accordion__header" 
        onClick={() => setOpen(!isOpen)}
      >
        <div className="group-accordion__header-content">
          <span className="group-accordion__title">{group.name}</span>
          <ChevronDown 
            className={`group-accordion__arrow${isOpen ? ' group-accordion__arrow--open' : ''}`}
            size={14}
          />
        </div>
      </button>
      
      {isOpen && (
        <div className="group-accordion__body">
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <div key={contact.id} className="group-accordion__contact">
                <div className="group-accordion__contact-info">
                  <div className="group-accordion__contact-name">
                    {contact.name}
                  </div>
                </div>
                
                <div className="group-accordion__actions">
                  <div className="group-accordion__contact-phone">
                    {contact.phone}
                  </div>
                  <button 
                    className="group-accordion__edit" 
                    onClick={() => onEdit(contact)}
                    title="Редактировать"
                  >
                    <img src={blackPencilIcon} alt="Редактировать" width={32} height={32} />
                  </button>
                  <button 
                    className="group-accordion__delete" 
                    onClick={() => onDelete(contact)}
                    title="Удалить"
                  >
                    <img src={blackDeleteIcon} alt="Удалить" width={32} height={32} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="group-accordion__empty">
              В этой группе пока нет контактов
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupAccordion; 