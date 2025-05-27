export class Contact {
  id: string;
  name: string;
  phone: string;
  group: string;

  constructor({ id, name, phone, group }: { id: string; name: string; phone: string; group: string }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.group = group;
  }
} 