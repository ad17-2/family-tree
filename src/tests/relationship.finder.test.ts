import { RelationshipBase } from "../relationships/relationship.finder";
import { Person } from "../models/person";

class TestRelationship extends RelationshipBase {
  find(person: Person): string[] {
    return this.getSiblings(person);
  }

  public testGetSiblings(person: Person): string[] {
    return this.getSiblings(person);
  }

  public testFilterByGender(
    names: string[],
    gender: "Male" | "Female",
    people: Map<string, Person>
  ): string[] {
    return this.filterByGender(names, gender, people);
  }
}

describe("RelationshipBase", () => {
  let relationship: TestRelationship;

  beforeEach(() => {
    relationship = new TestRelationship();
  });

  describe("getSiblings", () => {
    it("should get all siblings of a person", () => {
      const mother: Person = {
        name: "Mother",
        gender: "Female",
        children: [],
      };

      const child1: Person = {
        name: "Child1",
        gender: "Female",
        mother: mother,
        children: [],
      };

      const child2: Person = {
        name: "Child2",
        gender: "Male",
        mother: mother,
        children: [],
      };

      const child3: Person = {
        name: "Child3",
        gender: "Female",
        mother: mother,
        children: [],
      };

      mother.children = [child1, child2, child3];

      const siblings = relationship.testGetSiblings(child1);
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

      const siblings = relationship.testGetSiblings(person);
      expect(siblings).toHaveLength(0);
    });

    it("should return empty array when person is only child", () => {
      const mother: Person = {
        name: "Mother",
        gender: "Female",
        children: [],
      };

      const onlyChild: Person = {
        name: "OnlyChild",
        gender: "Female",
        mother: mother,
        children: [],
      };

      mother.children = [onlyChild];

      const siblings = relationship.testGetSiblings(onlyChild);
      expect(siblings).toHaveLength(0);
    });
  });

  describe("filterByGender", () => {
    let people: Map<string, Person>;

    beforeEach(() => {
      people = new Map<string, Person>();
    });

    it("should filter names by gender", () => {
      const male1: Person = {
        name: "Male1",
        gender: "Male",
        children: [],
      };

      const male2: Person = {
        name: "Male2",
        gender: "Male",
        children: [],
      };

      const female1: Person = {
        name: "Female1",
        gender: "Female",
        children: [],
      };

      people.set("Male1", male1);
      people.set("Male2", male2);
      people.set("Female1", female1);

      const names = ["Male1", "Male2", "Female1"];

      const males = relationship.testFilterByGender(names, "Male", people);
      expect(males).toContain("Male1");
      expect(males).toContain("Male2");
      expect(males).not.toContain("Female1");
      expect(males).toHaveLength(2);

      const females = relationship.testFilterByGender(names, "Female", people);
      expect(females).toContain("Female1");
      expect(females).not.toContain("Male1");
      expect(females).not.toContain("Male2");
      expect(females).toHaveLength(1);
    });

    it("should handle non-existent names", () => {
      const names = ["NonExistent"];
      const filtered = relationship.testFilterByGender(names, "Male", people);
      expect(filtered).toHaveLength(0);
    });

    it("should handle empty name list", () => {
      const filtered = relationship.testFilterByGender([], "Male", people);
      expect(filtered).toHaveLength(0);
    });
  });
});
