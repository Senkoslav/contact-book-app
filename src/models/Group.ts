export class Group {
  id: string;
  name: string;
 
  constructor({ id, name }: { id: string; name: string }) {
    this.id = id;
    this.name = name;
  }
} 