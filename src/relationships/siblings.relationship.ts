import { Person } from "../models/person";
import { RelationshipBase } from "./relationship.finder";

export class SiblingsRelationship extends RelationshipBase {
  find(person: Person): string[] {
    return this.getSiblings(person);
  }
}
