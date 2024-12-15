import { Person } from "../models/person";
import { ParentalSiblingRelationship } from "./parental-sibling.relationship";

export class MaternalUncleRelationship extends ParentalSiblingRelationship {
  constructor(people: Map<string, Person>) {
    super((person) => person.mother, "Male", people);
  }
}