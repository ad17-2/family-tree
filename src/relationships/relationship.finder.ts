import { Person } from "../models/person";
import { Gender } from "../types/gender.type";

export interface RelationshipFinder {
  find(person: Person): string[];
}

export abstract class RelationshipBase implements RelationshipFinder {
  abstract find(person: Person): string[];

  protected getSiblings(person: Person): string[] {
    if (!person.mother) return [];
    return person.mother.children
      .filter((child) => child !== person)
      .map((sibling) => sibling.name);
  }

  protected filterByGender(
    names: string[],
    gender: Gender,
    people: Map<string, Person>
  ): string[] {
    return names.filter((name) => people.get(name)?.gender === gender);
  }
}
