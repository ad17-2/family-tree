import { Person } from "../models/person";
import { RelationshipBase } from "./relationship.finder";

export class BrothersInLawRelationship extends RelationshipBase {
  constructor(private readonly people: Map<string, Person>) {
    super();
  }

  find(person: Person): string[] {
    const brothersInLaw = new Set<string>();

    /*
     * Spouse's brothers
     */
    if (person.spouse?.mother) {
      const spouseBrothers = this.filterByGender(
        this.getSiblings(person.spouse),
        "Male",
        this.people
      );
      spouseBrothers.forEach((brother) => brothersInLaw.add(brother));
    }

    /*
     * Siblings' husbands
     */
    if (person.mother) {
      const siblings = this.getSiblings(person);
      siblings.forEach((siblingName) => {
        const sibling = this.people.get(siblingName);
        if (sibling?.spouse?.gender === "Male") {
          brothersInLaw.add(sibling.spouse.name);
        }
      });
    }

    const result = Array.from(brothersInLaw);

    return result;
  }
}
