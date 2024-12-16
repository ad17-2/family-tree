import { ChildrenRelationship } from "../relationships/children.relationship";
import { Person } from "../models/person";

describe("ChildrenRelationship", () => {
  it("should find sons correctly", () => {
    const sonFinder = new ChildrenRelationship("Male");

    const son1: Person = {
      name: "Son1",
      gender: "Male",
      children: [],
    };

    const son2: Person = {
      name: "Son2",
      gender: "Male",
      children: [],
    };

    const daughter: Person = {
      name: "Daughter",
      gender: "Female",
      children: [],
    };

    const parent: Person = {
      name: "Parent",
      gender: "Female",
      children: [son1, son2, daughter],
    };

    const sons = sonFinder.find(parent);
    expect(sons).toContain("Son1");
    expect(sons).toContain("Son2");
    expect(sons).not.toContain("Daughter");
    expect(sons).toHaveLength(2);
  });

  it("should find daughters correctly", () => {
    const daughterFinder = new ChildrenRelationship("Female");

    const daughter1: Person = {
      name: "Daughter1",
      gender: "Female",
      children: [],
    };

    const daughter2: Person = {
      name: "Daughter2",
      gender: "Female",
      children: [],
    };

    const son: Person = {
      name: "Son",
      gender: "Male",
      children: [],
    };

    const parent: Person = {
      name: "Parent",
      gender: "Male",
      children: [daughter1, daughter2, son],
    };

    const daughters = daughterFinder.find(parent);
    expect(daughters).toContain("Daughter1");
    expect(daughters).toContain("Daughter2");
    expect(daughters).not.toContain("Son");
    expect(daughters).toHaveLength(2);
  });

  it("should return empty array for person with no children", () => {
    const sonFinder = new ChildrenRelationship("Male");
    const person: Person = {
      name: "Childless",
      gender: "Female",
      children: [],
    };

    const sons = sonFinder.find(person);
    expect(sons).toHaveLength(0);
  });

  it("should return empty array when no children of specified gender", () => {
    const sonFinder = new ChildrenRelationship("Male");

    const daughter1: Person = {
      name: "Daughter1",
      gender: "Female",
      children: [],
    };

    const daughter2: Person = {
      name: "Daughter2",
      gender: "Female",
      children: [],
    };

    const parent: Person = {
      name: "Parent",
      gender: "Female",
      children: [daughter1, daughter2],
    };

    const sons = sonFinder.find(parent);
    expect(sons).toHaveLength(0);
  });
});
