import React, { useState, useEffect } from 'react'
import './styles/main.scss'
import ContactForm from './components/ContactForm'
import { ContactManager } from './storage'
import { Contact } from './models/Contact'
import { Group } from './models/Group'
import GroupAccordion from './components/GroupAccordion'
import GroupManagerModal from './components/GroupManagerModal'
import { BookUser, Plus, X, CheckCircle } from 'lucide-react'

const manager = new ContactManager()

const App: React.FC = () => {
  const [isFormOpen, setFormOpen] = useState(false)
  const [isGroupsOpen, setGroupsOpen] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [editContact, setEditContact] = useState<Contact | null>(null)
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setGroups(manager.getGroups())
    setContacts(manager.getContacts())
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddContact = () => {
    setGroupsOpen(false);
    setFormOpen(true);
  }
  const handleEditContact = (contact: Contact) => {
    setGroupsOpen(false);
    setEditContact(contact);
    setFormOpen(true);
  }
  const handleDeleteContact = (contact: Contact) => {
    setDeleteContact(contact)
  }
  const handleConfirmDelete = () => {
    if (deleteContact) {
      manager.removeContact(deleteContact.id)
      setContacts(manager.getContacts())
      setToast('Контакт удалён')
    }
    setDeleteContact(null)
  }
  const handleSaveContact = (data: { name: string; phone: string; group: string }) => {
    if (editContact) {
      const updated = new Contact({ ...editContact, ...data })
      manager.editContact(updated)
      setContacts(manager.getContacts())
      setEditContact(null)
      setFormOpen(false)
      setToast('Контакт обновлён')
    } else {
      const id = Date.now().toString()
      const contact = new Contact({ id, ...data })
      if (manager.addContact(contact)) {
        setContacts(manager.getContacts())
        setFormOpen(false)
        setToast('Контакт успешно создан')
      } else {
        setToast('Контакт с таким номером уже существует!')
      }
    }
  }
  const handleOpenGroups = () => {
    setFormOpen(false);
    setEditContact(null);
    setGroupsOpen(true);
  }
  const handleCloseGroups = () => setGroupsOpen(false)
  const handleAddGroup = (name: string) => {
    if (!name.trim()) return;
    if (groups.some(g => g.name.toLowerCase() === name.trim().toLowerCase())) {
      setToast('Группа с таким именем уже существует!');
      return;
    }
    const id = Date.now().toString();
    manager.addGroup(new Group({ id, name: name.trim() }));
    setGroups(manager.getGroups());
    setToast('Группа добавлена');
  };
  const handleEditGroup = (id: string, name: string) => {
    if (!name.trim()) return;
    if (groups.some(g => g.name.toLowerCase() === name.trim().toLowerCase() && g.id !== id)) {
      setToast('Группа с таким именем уже существует!');
      return;
    }
    manager.editGroup(new Group({ id, name: name.trim() }));
    setGroups(manager.getGroups());
    setToast('Группа обновлена');
  };
  const handleDeleteGroup = (id: string) => {
    manager.removeGroup(id);
    setGroups(manager.getGroups());
    setContacts(manager.getContacts());
    setToast('Группа и все контакты удалены');
  };

  return (
    <div className="page-bg">
      <div className="container">
        <header className="header">
          <div className="header__left">
            <BookUser className="header__icon" aria-hidden="true" size={28} />
            <span className="header__title">Книга контактов</span>
          </div>
          <div className="header__right">
            <button className="header__btn header__btn--accent" onClick={handleAddContact}>
              <span className="header__btn-text-full">Добавить контакт</span>
              <span className="header__btn-text-short">Добавить</span>
              <Plus size={18} />
            </button>
            <button className="header__btn header__btn--primary" onClick={handleOpenGroups}>Группы</button>
          </div>
        </header>
        <main className="main">
          <div className="group-list">
            {groups.length > 0 ? (
              groups.map((group, idx) => (
                <GroupAccordion
                  key={group.id}
                  group={group}
                  contacts={contacts.filter(c => c.group === group.id)}
                  defaultOpen={idx === 0}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              ))
            ) : (
              <div className="contact-list__empty">
                Список контактов пуст
              </div>
            )}
          </div>
        </main>
      </div>
      {isFormOpen && (
        <ContactForm
          onClose={() => { setFormOpen(false); setEditContact(null); }}
          onSave={handleSaveContact}
          groups={groups}
          initial={editContact ? { name: editContact.name, phone: editContact.phone, group: editContact.group } : undefined}
        />
      )}
      {isGroupsOpen && (
        <GroupManagerModal
          groups={groups}
          onAdd={handleAddGroup}
          onEdit={handleEditGroup}
          onDelete={handleDeleteGroup}
          onClose={handleCloseGroups}
        />
      )}
      {deleteContact && (
        <div className="modal-groups">
          <div className="modal-groups__backdrop" onClick={() => setDeleteContact(null)}></div>
          <div className="modal-groups__window">
            <div className="modal-groups__header">
              <span>Удалить контакт?</span>
              
              <button className="contact-form__close" onClick={() => setDeleteContact(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-groups__body">
              <p>Вы уверены, что хотите удалить контакт <b>{deleteContact.name}</b>?</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="header__btn header__btn--primary" onClick={handleConfirmDelete}>Удалить</button>
                <button className="header__btn" onClick={() => setDeleteContact(null)}>Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className={`toast toast--show`}>
          <div className="toast__content">
            <CheckCircle className="toast__icon" size={18} />
            {toast}
          </div>
        </div>
      )}
      </div>
  )
}

export default App
