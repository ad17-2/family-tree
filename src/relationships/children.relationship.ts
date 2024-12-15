import { Person } from "../models/person";
import { Gender } from "../types/gender.type";
import { RelationshipBase } from "./relationship.finder";

export class ChildrenRelationship extends RelationshipBase {
  constructor(private readonly gender: Gender) {
    super();
  }

  find(person: Person): string[] {
    return person.children
      .filter((child) => child.gender === this.gender)
      .map((child) => child.name);
  }
}
