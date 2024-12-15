import { Person } from "../models/person";
import { Gender } from "../types/gender.type";
import { RelationshipType } from "../types/relationship.type";
import { RelationshipFinder } from "../relationships/relationship.finder";
import { Errors } from "../utils/family-tree.error.util";
import { FamilyTreeError } from "../errors/family-tree.error";
import { SiblingsRelationship } from "../relationships/siblings.relationship";
import { ChildrenRelationship } from "../relationships/children.relationship";
import { SistersInLawRelationship } from "../relationships/sisters-in-law.relationship";
import { BrothersInLawRelationship } from "../relationships/brothers-in-law.relationship";
import { MaternalAuntRelationship } from "../relationships/maternal-aunt.relationship";
import { PaternalAuntRelationship } from "../relationships/paternal-aunt.relationship";
import { MaternalUncleRelationship } from "../relationships/maternal-uncle.relationship";
import { PaternalUncleRelationship } from "../relationships/paternal-uncle.relationship";

export class FamilyTree {
  private people: Map<string, Person> = new Map();
  private relationshipHandlers: Map<RelationshipType, RelationshipFinder>;

  constructor() {
    this.initializeRelationshipHandlers();
  }

  private initializeRelationshipHandlers() {
    this.relationshipHandlers = new Map([
      ["Siblings", new SiblingsRelationship()],
      ["Son", new ChildrenRelationship("Male")],
      ["Daughter", new ChildrenRelationship("Female")],
      ["Sister-In-Law", new SistersInLawRelationship(this.people)],
      ["Brother-In-Law", new BrothersInLawRelationship(this.people)],
      ["Maternal-Aunt", new MaternalAuntRelationship(this.people)],
      ["Paternal-Aunt", new PaternalAuntRelationship(this.people)],
      ["Maternal-Uncle", new MaternalUncleRelationship(this.people)],
      ["Paternal-Uncle", new PaternalUncleRelationship(this.people)],
    ]);
  }

  public addPerson(name: string, gender: Gender): Person | null {
    try {
      const person = this.createPerson(name, gender);
      console.log("PERSON_ADDED");
      return person;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  public addChild(
    motherName: string,
    childName: string,
    gender: Gender
  ): Person | null {
    try {
      const mother = this.getPerson(motherName);

      if (mother.gender !== "Female") {
        throw Errors.childAdditionFailed("Only mothers can add children");
      }

      const child = this.createPerson(childName, gender);
      this.setupChildRelationships(mother, child);

      console.log("CHILD_ADDED");
      return child;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  public initializeFamily(
    person1Name: string,
    person1Gender: Gender,
    person2Name: string,
    person2Gender: Gender
  ): void {
    try {
      const person1 = this.createPerson(person1Name, person1Gender);
      const person2 = this.createPerson(person2Name, person2Gender);

      this.setSpouse(person1, person2);

      console.log("FAMILY_INITIALIZED");
    } catch (error) {
      this.handleError(error);
    }
  }

  public addSpouse(person1Name: string, person2Name: string): void {
    try {
      const person1 = this.getPerson(person1Name);
      const person2 = this.getPerson(person2Name);

      this.setSpouse(person1, person2);
    } catch (error) {
      this.handleError(error);
    }
  }

  public getRelationship(
    name: string,
    relationship: RelationshipType
  ): string[] {
    try {
      const person = this.getPerson(name);
      const handler = this.relationshipHandlers.get(relationship);

      if (!handler) {
        throw Errors.invalidRelationship(relationship);
      }

      const result = handler.find(person);

      if (result.length === 0) {
        console.log("NONE");
      }
      return result;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  private createPerson(name: string, gender: Gender): Person {
    if (this.people.has(name)) {
      throw Errors.duplicatePerson(name);
    }

    const person: Person = {
      name,
      gender,
      children: [],
    };
    this.people.set(name, person);
    return person;
  }

  private getPerson(name: string): Person {
    const person = this.people.get(name);
    if (!person) {
      throw Errors.personNotFound(name);
    }
    return person;
  }

  private setSpouse(person1: Person, person2: Person): void {
    if (person1.gender === person2.gender) {
      throw Errors.invalidSpouse();
    }
    if (person1.spouse || person2.spouse) {
      throw Errors.alreadyMarried();
    }

    person1.spouse = person2;
    person2.spouse = person1;

    console.log("SPOUSE_ADDED");
  }

  private setupChildRelationships(mother: Person, child: Person): void {
    child.mother = mother;

    if (mother.spouse) {
      child.father = mother.spouse;
    }

    mother.children.push(child);
    if (mother.spouse) {
      mother.spouse.children.push(child);
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof FamilyTreeError) {
      console.log(error.code);
    } else {
      console.log("CHILD_ADDITION_FAILED");
    }
  }
}
