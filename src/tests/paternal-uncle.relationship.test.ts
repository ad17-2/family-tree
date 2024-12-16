import { PaternalUncleRelationship } from "../relationships/paternal-uncle.relationship";
import { Person } from "../models/person";

describe("PaternalUncleRelationship", () => {
  let people: Map<string, Person>;
  let paternalUncleFinder: PaternalUncleRelationship;

  beforeEach(() => {
    people = new Map<string, Person>();
    paternalUncleFinder = new PaternalUncleRelationship(people);
  });

  it("should find paternal uncles", () => {
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
      father: father,
      children: [],
    };

    grandmother.children = [father, uncle1, uncle2, aunt];
    father.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Father", father);
    people.set("Uncle1", uncle1);
    people.set("Uncle2", uncle2);
    people.set("Aunt", aunt);
    people.set("Person", person);

    const paternalUncles = paternalUncleFinder.find(person);
    expect(paternalUncles).toContain("Uncle1");
    expect(paternalUncles).toContain("Uncle2");
    expect(paternalUncles).not.toContain("Aunt");
    expect(paternalUncles).toHaveLength(2);
  });

  it("should return empty array when person has no father", () => {
    const person: Person = {
      name: "Person",
      gender: "Male",
      children: [],
    };

    people.set("Person", person);

    const paternalUncles = paternalUncleFinder.find(person);
    expect(paternalUncles).toHaveLength(0);
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

    const paternalUncles = paternalUncleFinder.find(person);
    expect(paternalUncles).toHaveLength(0);
  });

  it("should return empty array when father has no brothers", () => {
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

    const aunt: Person = {
      name: "Aunt",
      gender: "Female",
      mother: grandmother,
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      father: father,
      children: [],
    };

    grandmother.children = [father, aunt];
    father.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Father", father);
    people.set("Aunt", aunt);
    people.set("Person", person);

    const paternalUncles = paternalUncleFinder.find(person);
    expect(paternalUncles).toHaveLength(0);
  });
});
