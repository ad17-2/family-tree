import { SiblingsRelationship } from "../relationships/siblings.relationship";
import { Person } from "../models/person";

describe("SiblingsRelationship", () => {
  let siblingsFinder: SiblingsRelationship;

  beforeEach(() => {
    siblingsFinder = new SiblingsRelationship();
  });

  it("should find all siblings", () => {
    const mother: Person = {
      name: "Mother",
      gender: "Female",
      children: [],
    };

    const child1: Person = {
      name: "Child1",
      gender: "Male",
      mother: mother,
      children: [],
    };

    const child2: Person = {
      name: "Child2",
      gender: "Female",
      mother: mother,
      children: [],
    };

    const child3: Person = {
      name: "Child3",
      gender: "Male",
      mother: mother,
      children: [],
    };

    mother.children = [child1, child2, child3];

    const siblings = siblingsFinder.find(child1);
    expect(siblings).toContain("Child2");
    expect(siblings).toContain("Child3");
    expect(siblings).not.toContain("Child1");
    expect(siblings).toHaveLength(2);
  });

  it("should return empty array when person has no mother", () => {
    const person: Person = {
      name: "Person",
      gender: "Male",
      children: [],
    };

    const siblings = siblingsFinder.find(person);
    expect(siblings).toHaveLength(0);
  });

  it("should return empty array for only child", () => {
    const mother: Person = {
      name: "Mother",
      gender: "Female",
      children: [],
    };

    const onlyChild: Person = {
      name: "OnlyChild",
      gender: "Male",
      mother: mother,
      children: [],
    };

    mother.children = [onlyChild];

    const siblings = siblingsFinder.find(onlyChild);
    expect(siblings).toHaveLength(0);
  });

  it("should not consider half-siblings through father", () => {
    const mother1: Person = {
      name: "Mother1",
      gender: "Female",
      children: [],
    };

    const mother2: Person = {
      name: "Mother2",
      gender: "Female",
      children: [],
    };

    const father: Person = {
      name: "Father",
      gender: "Male",
      children: [],
    };

    const child1: Person = {
      name: "Child1",
      gender: "Male",
      mother: mother1,
      father: father,
      children: [],
    };

    const child2: Person = {
      name: "Child2",
      gender: "Female",
      mother: mother2,
      father: father,
      children: [],
    };

    mother1.children = [child1];
    mother2.children = [child2];
    father.children = [child1, child2];

    const siblings = siblingsFinder.find(child1);
    expect(siblings).toHaveLength(0);
  });
});
