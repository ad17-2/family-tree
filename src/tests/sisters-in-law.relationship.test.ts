import { SistersInLawRelationship } from "../relationships/sisters-in-law.relationship";
import { Person } from "../models/person";

describe("SistersInLawRelationship", () => {
  let people: Map<string, Person>;
  let sistersInLawFinder: SistersInLawRelationship;

  beforeEach(() => {
    people = new Map<string, Person>();
    sistersInLawFinder = new SistersInLawRelationship(people);
  });

  describe("Spouse's Sisters", () => {
    it("should find sisters-in-law through spouse's sisters", () => {
      const motherInLaw: Person = {
        name: "MotherInLaw",
        gender: "Female",
        children: [],
      };

      const wife: Person = {
        name: "Wife",
        gender: "Female",
        mother: motherInLaw,
        children: [],
      };

      const sisterInLaw1: Person = {
        name: "SisterInLaw1",
        gender: "Female",
        mother: motherInLaw,
        children: [],
      };

      const sisterInLaw2: Person = {
        name: "SisterInLaw2",
        gender: "Female",
        mother: motherInLaw,
        children: [],
      };

      const brotherInLaw: Person = {
        name: "BrotherInLaw",
        gender: "Male",
        mother: motherInLaw,
        children: [],
      };

      const person: Person = {
        name: "Person",
        gender: "Male",
        spouse: wife,
        children: [],
      };

      wife.spouse = person;
      motherInLaw.children = [wife, sisterInLaw1, sisterInLaw2, brotherInLaw];

      people.set("MotherInLaw", motherInLaw);
      people.set("Wife", wife);
      people.set("SisterInLaw1", sisterInLaw1);
      people.set("SisterInLaw2", sisterInLaw2);
      people.set("BrotherInLaw", brotherInLaw);
      people.set("Person", person);

      const sistersInLaw = sistersInLawFinder.find(person);
      expect(sistersInLaw).toContain("SisterInLaw1");
      expect(sistersInLaw).toContain("SisterInLaw2");
      expect(sistersInLaw).not.toContain("BrotherInLaw");
      expect(sistersInLaw).toHaveLength(2);
    });

    it("should handle case where spouse has no mother", () => {
      const person: Person = {
        name: "Person",
        gender: "Male",
        spouse: {
          name: "Wife",
          gender: "Female",
          children: [],
        },
        children: [],
      };

      people.set("Person", person);

      const sistersInLaw = sistersInLawFinder.find(person);
      expect(sistersInLaw).toHaveLength(0);
    });
  });

  describe("Siblings' Wives", () => {
    it("should find sisters-in-law through siblings' wives", () => {
      const mother: Person = {
        name: "Mother",
        gender: "Female",
        children: [],
      };

      const brother1: Person = {
        name: "Brother1",
        gender: "Male",
        mother: mother,
        children: [],
      };

      const brother2: Person = {
        name: "Brother2",
        gender: "Male",
        mother: mother,
        children: [],
      };

      const brotherWife1: Person = {
        name: "BrotherWife1",
        gender: "Female",
        children: [],
      };

      const brotherWife2: Person = {
        name: "BrotherWife2",
        gender: "Female",
        children: [],
      };

      const person: Person = {
        name: "Person",
        gender: "Female",
        mother: mother,
        children: [],
      };

      brother1.spouse = brotherWife1;
      brotherWife1.spouse = brother1;
      brother2.spouse = brotherWife2;
      brotherWife2.spouse = brother2;

      mother.children = [brother1, brother2, person];

      people.set("Mother", mother);
      people.set("Brother1", brother1);
      people.set("Brother2", brother2);
      people.set("BrotherWife1", brotherWife1);
      people.set("BrotherWife2", brotherWife2);
      people.set("Person", person);

      const sistersInLaw = sistersInLawFinder.find(person);
      expect(sistersInLaw).toContain("BrotherWife1");
      expect(sistersInLaw).toContain("BrotherWife2");
      expect(sistersInLaw).toHaveLength(2);
    });

    it("should handle case where siblings are not married", () => {
      const mother: Person = {
        name: "Mother",
        gender: "Female",
        children: [],
      };

      const brother: Person = {
        name: "Brother",
        gender: "Male",
        mother: mother,
        children: [],
      };

      const person: Person = {
        name: "Person",
        gender: "Female",
        mother: mother,
        children: [],
      };

      mother.children = [brother, person];

      people.set("Mother", mother);
      people.set("Brother", brother);
      people.set("Person", person);

      const sistersInLaw = sistersInLawFinder.find(person);
      expect(sistersInLaw).toHaveLength(0);
    });
  });

  describe("Combined Cases", () => {
    it("should find all sisters-in-law from both sources", () => {
      const mother: Person = {
        name: "Mother",
        gender: "Female",
        children: [],
      };

      const brother: Person = {
        name: "Brother",
        gender: "Male",
        mother: mother,
        children: [],
      };

      const brotherWife: Person = {
        name: "BrotherWife",
        gender: "Female",
        children: [],
      };

      const motherInLaw: Person = {
        name: "MotherInLaw",
        gender: "Female",
        children: [],
      };

      const wife: Person = {
        name: "Wife",
        gender: "Female",
        mother: motherInLaw,
        children: [],
      };

      const wifeSister: Person = {
        name: "WifeSister",
        gender: "Female",
        mother: motherInLaw,
        children: [],
      };

      const person: Person = {
        name: "Person",
        gender: "Male",
        mother: mother,
        spouse: wife,
        children: [],
      };

      brother.spouse = brotherWife;
      brotherWife.spouse = brother;
      wife.spouse = person;

      mother.children = [brother, person];
      motherInLaw.children = [wife, wifeSister];

      people.set("Mother", mother);
      people.set("Brother", brother);
      people.set("BrotherWife", brotherWife);
      people.set("MotherInLaw", motherInLaw);
      people.set("Wife", wife);
      people.set("WifeSister", wifeSister);
      people.set("Person", person);

      const sistersInLaw = sistersInLawFinder.find(person);
      expect(sistersInLaw).toContain("BrotherWife");
      expect(sistersInLaw).toContain("WifeSister");
      expect(sistersInLaw).toHaveLength(2);
    });
  });
});
