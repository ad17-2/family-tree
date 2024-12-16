import { MaternalAuntRelationship } from "../relationships/maternal-aunt.relationship";
import { Person } from "../models/person";

describe("MaternalAuntRelationship", () => {
  let people: Map<string, Person>;
  let maternalAuntFinder: MaternalAuntRelationship;

  beforeEach(() => {
    people = new Map<string, Person>();
    maternalAuntFinder = new MaternalAuntRelationship(people);
  });

  it("should find maternal aunts", () => {
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
      mother: mother,
      children: [],
    };

    grandmother.children = [mother, aunt1, aunt2, uncle];
    mother.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Mother", mother);
    people.set("Aunt1", aunt1);
    people.set("Aunt2", aunt2);
    people.set("Uncle", uncle);
    people.set("Person", person);

    const maternalAunts = maternalAuntFinder.find(person);
    expect(maternalAunts).toContain("Aunt1");
    expect(maternalAunts).toContain("Aunt2");
    expect(maternalAunts).not.toContain("Uncle");
    expect(maternalAunts).toHaveLength(2);
  });

  it("should return empty array when person has no mother", () => {
    const person: Person = {
      name: "Person",
      gender: "Male",
      children: [],
    };

    people.set("Person", person);

    const maternalAunts = maternalAuntFinder.find(person);
    expect(maternalAunts).toHaveLength(0);
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

    const maternalAunts = maternalAuntFinder.find(person);
    expect(maternalAunts).toHaveLength(0);
  });

  it("should return empty array when mother has no sisters", () => {
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

    const uncle: Person = {
      name: "Uncle",
      gender: "Male",
      mother: grandmother,
      children: [],
    };

    const person: Person = {
      name: "Person",
      gender: "Male",
      mother: mother,
      children: [],
    };

    grandmother.children = [mother, uncle];
    mother.children = [person];

    people.set("Grandmother", grandmother);
    people.set("Mother", mother);
    people.set("Uncle", uncle);
    people.set("Person", person);

    const maternalAunts = maternalAuntFinder.find(person);
    expect(maternalAunts).toHaveLength(0);
  });
});
