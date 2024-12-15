import { Person } from "../models/person";
import { RelationshipBase } from "./relationship.finder";

export class SiblingsRelationship extends RelationshipBase {
  find(person: Person): string[] {
    if (!person.mother) {
      return [];
    }
    const siblings = person.mother.children
      .filter((child) => child !== person)
      .map((sibling) => sibling.name);
    return siblings;
  }
}
