import { MaternalUncleRelationship } from "../relationships/maternal-uncle.relationship";
import { Person } from "../models/person";

describe("MaternalUncleRelationship", () => {
  let people: Map<string, Person>;
  let maternalUncleFinder: MaternalUncleRelationship;

  beforeEach(() => {
    people = new Map<string, Person>();
    maternalUncleFinder = new MaternalUncleRelationship(people);
  });

  it("should find maternal uncles", () => {
    const grandmother: Person = {
      name: "Grandmother",
      gender: "Female",
      children: [],
    };

    const mother: Person = {
      name: "Mother",
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
      mother: mother,
      children: [],
    };

    grandmother.children = [mother, uncle1, uncle2, aunt];
    mother.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Mother", mother);
    people.set("Uncle1", uncle1);
    people.set("Uncle2", uncle2);
    people.set("Aunt", aunt);
    people.set("Person", person);

    const maternalUncles = maternalUncleFinder.find(person);
    expect(maternalUncles).toContain("Uncle1");
    expect(maternalUncles).toContain("Uncle2");
    expect(maternalUncles).not.toContain("Aunt");
    expect(maternalUncles).toHaveLength(2);
  });

  it("should return empty array when person has no mother", () => {
    const person: Person = {
      name: "Person",
      gender: "Male",
      children: [],
    };

    people.set("Person", person);

    const maternalUncles = maternalUncleFinder.find(person);
    expect(maternalUncles).toHaveLength(0);
  });

  it("should return empty array when mother has no mother", () => {
    const mother: Person = {
      name: "Mother",
      gender: "Female",
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      mother: mother,
      children: [],
    };

    mother.children = [person];

    people.set("Mother", mother);
    people.set("Person", person);

    const maternalUncles = maternalUncleFinder.find(person);
    expect(maternalUncles).toHaveLength(0);
  });

  it("should return empty array when mother has no brothers", () => {
    const grandmother: Person = {
      name: "Grandmother",
      gender: "Female",
      children: [],
    };

    const mother: Person = {
      name: "Mother",
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
      mother: mother,
      children: [],
    };

    grandmother.children = [mother, aunt];
    mother.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Mother", mother);
    people.set("Aunt", aunt);
    people.set("Person", person);

    const maternalUncles = maternalUncleFinder.find(person);
    expect(maternalUncles).toHaveLength(0);
  });
});
