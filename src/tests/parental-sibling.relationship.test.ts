import { ParentalSiblingRelationship } from "../relationships/parental-sibling.relationship";
import { Person } from "../models/person";

class TestParentalSiblingRelationship extends ParentalSiblingRelationship {
  constructor(
    people: Map<string, Person>,
    gender: "Male" | "Female" = "Male",
    getParent: (person: Person) => Person | undefined = (p) => p.mother
  ) {
    super(getParent, gender, people);
  }
}

describe("ParentalSiblingRelationship", () => {
  let people: Map<string, Person>;
  let relationship: TestParentalSiblingRelationship;

  beforeEach(() => {
    people = new Map<string, Person>();
  });

  it("should find parent's siblings of specified gender", () => {
    const grandmother: Person = {
      name: "Grandmother",
      gender: "Female",
      children: [],
    };

    const parent: Person = {
      name: "Parent",
      gender: "Female",
      mother: grandmother,
      children: [],
    };

    const uncle1: Person = {
      name: "Uncle1",
      gender: "Male",
      mother: grandmother,
      children: [],
    };

    const uncle2: Person = {
      name: "Uncle2",
      gender: "Male",
      mother: grandmother,
      children: [],
    };

    const aunt: Person = {
      name: "Aunt",
      gender: "Female",
      mother: grandmother,
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      mother: parent,
      children: [],
    };

    grandmother.children = [parent, uncle1, uncle2, aunt];
    parent.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Parent", parent);
    people.set("Uncle1", uncle1);
    people.set("Uncle2", uncle2);
    people.set("Aunt", aunt);
    people.set("Person", person);

    relationship = new TestParentalSiblingRelationship(people, "Male");
    const uncles = relationship.find(person);
    expect(uncles).toContain("Uncle1");
    expect(uncles).toContain("Uncle2");
    expect(uncles).not.toContain("Aunt");
    expect(uncles).toHaveLength(2);
  });

  it("should handle custom parent getter", () => {
    const grandfather: Person = {
      name: "Grandfather",
      gender: "Male",
      children: [],
    };

    const grandmother: Person = {
      name: "Grandmother",
      gender: "Female",
      children: [],
    };

    const father: Person = {
      name: "Father",
      gender: "Male",
      father: grandfather,
      mother: grandmother,
      children: [],
    };

    const paternalAunt: Person = {
      name: "PaternalAunt",
      gender: "Female",
      father: grandfather,
      mother: grandmother,
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      father: father,
      children: [],
    };

    grandmother.children = [father, paternalAunt];
    grandfather.children = [father, paternalAunt];

    people.set("Grandfather", grandfather);
    people.set("Grandmother", grandmother);
    people.set("Father", father);
    people.set("PaternalAunt", paternalAunt);
    people.set("Person", person);

    const getParent = (p: Person) => p.father;
    relationship = new TestParentalSiblingRelationship(
      people,
      "Female",
      getParent
    );

    const paternalAunts = relationship.find(person);
    expect(paternalAunts).toContain("PaternalAunt");
    expect(paternalAunts).toHaveLength(1);
  });

  it("should return empty array when parent has no mother", () => {
    const parent: Person = {
      name: "Parent",
      gender: "Female",
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      mother: parent,
      children: [],
    };

    parent.children = [person];

    people.set("Parent", parent);
    people.set("Person", person);

    relationship = new TestParentalSiblingRelationship(people);
    const relatives = relationship.find(person);
    expect(relatives).toHaveLength(0);
  });

  it("should return empty array when parent not found", () => {
    const person: Person = {
      name: "Person",
      gender: "Male",
      children: [],
    };

    people.set("Person", person);

    relationship = new TestParentalSiblingRelationship(people);
    const relatives = relationship.find(person);
    expect(relatives).toHaveLength(0);
  });

  it("should return empty array when parent has no siblings of specified gender", () => {
    const grandmother: Person = {
      name: "Grandmother",
      gender: "Female",
      children: [],
    };

    const parent: Person = {
      name: "Parent",
      gender: "Female",
      mother: grandmother,
      children: [],
    };

    const aunt: Person = {
      name: "Aunt",
      gender: "Female",
      mother: grandmother,
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      mother: parent,
      children: [],
    };

    grandmother.children = [parent, aunt];
    parent.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Parent", parent);
    people.set("Aunt", aunt);
    people.set("Person", person);

    relationship = new TestParentalSiblingRelationship(people, "Male");
    const uncles = relationship.find(person);
    expect(uncles).toHaveLength(0);
  });
});
