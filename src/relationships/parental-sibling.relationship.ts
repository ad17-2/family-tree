import { Person } from "../models/person";
import { Gender } from "../types/gender.type";
import { RelationshipBase } from "./relationship.finder";

export abstract class ParentalSiblingRelationship extends RelationshipBase {
  constructor(
    private readonly getParent: (person: Person) => Person | undefined,
    private readonly gender: Gender,
    private readonly people: Map<string, Person>
  ) {
    super();
  }

  find(person: Person): string[] {
    const parent = this.getParent(person);

    if (!parent?.mother) {
      return [];
    }

    const siblings = this.getSiblings(parent);

    const filteredSiblings = this.filterByGender(
      siblings,
      this.gender,
      this.people
    );

    return filteredSiblings;
  }
}
