import { PaternalAuntRelationship } from "../relationships/paternal-aunt.relationship";
import { Person } from "../models/person";

describe("PaternalAuntRelationship", () => {
  let people: Map<string, Person>;
  let paternalAuntFinder: PaternalAuntRelationship;

  beforeEach(() => {
    people = new Map<string, Person>();
    paternalAuntFinder = new PaternalAuntRelationship(people);
  });

  it("should find paternal aunts", () => {
    const grandmother: Person = {
      name: "Grandmother",
      gender: "Female",
      children: [],
    };

    const father: Person = {
      name: "Father",
      gender: "Male",
      mother: grandmother,
      children: [],
    };

    const aunt1: Person = {
      name: "Aunt1",
      gender: "Female",
      mother: grandmother,
      children: [],
    };

    const aunt2: Person = {
      name: "Aunt2",
      gender: "Female",
      mother: grandmother,
      children: [],
    };

    const uncle: Person = {
      name: "Uncle",
      gender: "Male",
      mother: grandmother,
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      father: father,
      children: [],
    };

    grandmother.children = [father, aunt1, aunt2, uncle];
    father.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Father", father);
    people.set("Aunt1", aunt1);
    people.set("Aunt2", aunt2);
    people.set("Uncle", uncle);
    people.set("Person", person);

    const paternalAunts = paternalAuntFinder.find(person);
    expect(paternalAunts).toContain("Aunt1");
    expect(paternalAunts).toContain("Aunt2");
    expect(paternalAunts).not.toContain("Uncle");
    expect(paternalAunts).toHaveLength(2);
  });

  it("should return empty array when person has no father", () => {
    const person: Person = {
      name: "Person",
      gender: "Male",
      children: [],
    };

    people.set("Person", person);

    const paternalAunts = paternalAuntFinder.find(person);
    expect(paternalAunts).toHaveLength(0);
  });

  it("should return empty array when father has no mother", () => {
    const father: Person = {
      name: "Father",
      gender: "Male",
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      father: father,
      children: [],
    };

    father.children = [person];

    people.set("Father", father);
    people.set("Person", person);

    const paternalAunts = paternalAuntFinder.find(person);
    expect(paternalAunts).toHaveLength(0);
  });

  it("should return empty array when father has no sisters", () => {
    const grandmother: Person = {
      name: "Grandmother",
      gender: "Female",
      children: [],
    };

    const father: Person = {
      name: "Father",
      gender: "Male",
      mother: grandmother,
      children: [],
    };

    const uncle: Person = {
      name: "Uncle",
      gender: "Male",
      mother: grandmother,
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      father: father,
      children: [],
    };

    grandmother.children = [father, uncle];
    father.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Father", father);
    people.set("Uncle", uncle);
    people.set("Person", person);

    const paternalAunts = paternalAuntFinder.find(person);
    expect(paternalAunts).toHaveLength(0);
  });
});
