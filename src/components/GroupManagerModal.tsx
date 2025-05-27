import React, { useState, useRef, useEffect } from 'react';
import { Group } from '../models/Group';
import { X, Check } from 'lucide-react';
import whiteDeleteIcon from '../assets/Delete forever.svg';

interface GroupManagerModalProps {
  groups: Group[];
  onAdd: (name: string) => void;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const GroupManagerModal: React.FC<GroupManagerModalProps> = ({ groups, onAdd, onEdit, onDelete, onClose }) => {
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [editError, setEditError] = useState('');
  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editId && editInputRef.current) editInputRef.current.focus();
    if (!editId && addInputRef.current) addInputRef.current.focus();
  }, [editId]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    
    if (!trimmedName) {
      setError('Введите название группы');
      return;
    }
    
    if (groups.some(g => g.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Группа с таким названием уже существует');
      return;
    }
    
    onAdd(trimmedName);
    setNewName('');
    setError('');
  };

  const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
    if (error) setError('');
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
    if (editError) setEditError('');
  };

  const handleEditSubmit = (id: string) => {
    const trimmedName = editName.trim();
    
    if (!trimmedName) {
      setEditError('Введите название группы');
      return;
    }
    
    if (groups.some(g => g.name.toLowerCase() === trimmedName.toLowerCase() && g.id !== id)) {
      setEditError('Группа с таким названием уже существует');
      return;
    }
    
    onEdit(id, trimmedName);
    setEditId(null);
    setEditName('');
    setEditError('');
  };

  return (
    <>
      <div className="groups-sidebar">
        <div className="groups-sidebar__header">
          <span className="groups-sidebar__title">Группы контактов</span>
          <button className="groups-sidebar__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="groups-sidebar__body">
          <form className="group-manager__add-form">
            <div className="group-manager__field">
              <input 
                ref={addInputRef}
                value={newName}
                onChange={handleNewNameChange}
                className={`group-manager__new-input${error ? ' group-manager__new-input--error' : ''}`}
                placeholder="Новая группа"
              />
              {error && <span className="group-manager__error">{error}</span>}
            </div>
          </form>

          <div className="group-manager__list">
            {groups.map(g => (
              <div className="group-manager__item" key={g.id}>
                {editId === g.id ? (
                  <div className="group-manager__edit-form">
                    <div className="group-manager__field">
                      <input 
                        ref={editInputRef}
                        value={editName}
                        onChange={handleEditNameChange}
                        className={`group-manager__edit-input${editError ? ' group-manager__edit-input--error' : ''}`}
                      />
                      {editError && <span className="group-manager__error">{editError}</span>}
                    </div>
                    <div className="group-manager__edit-actions">
                      <button 
                        className="group-manager__save-edit" 
                        onClick={() => handleEditSubmit(g.id)}
                      >
                        <Check size={14}/>
                      </button>
                      <button 
                        className="group-manager__cancel-edit" 
                        onClick={() => {
                          setEditId(null);
                          setEditName('');
                          setEditError('');
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group-manager__view">
                    <span className="group-manager__name">{g.name}</span>
                    <div className="group-manager__actions">
                      <button 
                        className="group-manager__delete" 
                        onClick={() => setDeleteId(g.id)}
                      >
                        <img src={whiteDeleteIcon} alt="Удалить" width={32} height={32} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="groups-sidebar__footer">
          <button className="group-manager__add-btn" onClick={handleAddSubmit}>
            Добавить группу
          </button>
        </div>
      </div>
      
      {deleteId && (
        <div className="modal-groups">
          <div className="modal-groups__backdrop" onClick={() => setDeleteId(null)}></div>
          <div className="modal-groups__window">
            <div className="modal-groups__header">
              <span>Удалить группу?</span>
              <button className="groups-sidebar__close" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-groups__body">
              <p>Удаление группы повлечет за собой удаление контактов связанных с этой группой</p>
              <div className="modal-actions">
                <button className="modal-btn modal-btn--secondary" onClick={() => setDeleteId(null)}>
                  Отмена
                </button>
                <button className="modal-btn modal-btn--primary" onClick={() => { onDelete(deleteId); setDeleteId(null); }}>
                  Да, удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupManagerModal; 