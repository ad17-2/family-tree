import { Person } from "../models/person";
import { RelationshipBase } from "./relationship.finder";

export class SistersInLawRelationship extends RelationshipBase {
  constructor(private readonly people: Map<string, Person>) {
    super();
  }

  find(person: Person): string[] {
    const sistersInLaw = new Set<string>();

    /*
     * Spouse's sisters
     */
    if (person.spouse?.mother) {
      const spouseSisters = this.filterByGender(
        this.getSiblings(person.spouse),
        "Female",
        this.people
      );
      spouseSisters.forEach((sister) => sistersInLaw.add(sister));
    }

    /*
     * Siblings' wives
     */
    if (person.mother) {
      const siblings = this.getSiblings(person);
      siblings.forEach((siblingName) => {
        const sibling = this.people.get(siblingName);
        if (sibling?.spouse?.gender === "Female") {
          sistersInLaw.add(sibling.spouse.name);
        }
      });
    }

    const result = Array.from(sistersInLaw);

    return result;
  }
}
