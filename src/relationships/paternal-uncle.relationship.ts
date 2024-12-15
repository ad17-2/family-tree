import { Person } from "../models/person";
import { ParentalSiblingRelationship } from "./parental-sibling.relationship";

export class PaternalUncleRelationship extends ParentalSiblingRelationship {
  constructor(people: Map<string, Person>) {
    super((person) => person.father, "Male", people);
  }
}
