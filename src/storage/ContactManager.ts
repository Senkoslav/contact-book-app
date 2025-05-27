import { Contact } from '../models/Contact';
import { Group } from '../models/Group';

export class ContactManager {
  private static CONTACTS_KEY = 'contacts';
  private static GROUPS_KEY = 'groups';

  getContacts(): Contact[] {
    const raw = localStorage.getItem(ContactManager.CONTACTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  }

  saveContacts(contacts: Contact[]) {
    localStorage.setItem(ContactManager.CONTACTS_KEY, JSON.stringify(contacts));
  }

  addContact(contact: Contact): boolean {
    const contacts = this.getContacts();
    if (contacts.some(c => c.phone === contact.phone)) return false;
    contacts.push(contact);
    this.saveContacts(contacts);
    return true;
  }

  removeContact(id: string) {
    const contacts = this.getContacts().filter(c => c.id !== id);
    this.saveContacts(contacts);
  }

  editContact(updated: Contact) {
    const contacts = this.getContacts().map(c => c.id === updated.id ? updated : c);
    this.saveContacts(contacts);
  }

  getGroups(): Group[] {
    const raw = localStorage.getItem(ContactManager.GROUPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  }

  saveGroups(groups: Group[]) {
    localStorage.setItem(ContactManager.GROUPS_KEY, JSON.stringify(groups));
  }

  addGroup(group: Group): boolean {
    const groups = this.getGroups();
    if (groups.some(g => g.name.toLowerCase() === group.name.toLowerCase())) return false;
    groups.push(group);
    this.saveGroups(groups);
    return true;
  }

  removeGroup(id: string) {
    const groups = this.getGroups().filter(g => g.id !== id);
    this.saveGroups(groups);
    const contacts = this.getContacts().filter(c => c.group !== id);
    this.saveContacts(contacts);
  }

  editGroup(updated: Group) {
    const groups = this.getGroups().map(g => g.id === updated.id ? updated : g);
    this.saveGroups(groups);
  }
} 