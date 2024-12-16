import { BrothersInLawRelationship } from "../relationships/brothers-in-law.relationship";
import { Person } from "../models/person";

describe("BrothersInLawRelationship", () => {
  let people: Map<string, Person>;
  let brothersInLawFinder: BrothersInLawRelationship;

  beforeEach(() => {
    people = new Map<string, Person>();
    brothersInLawFinder = new BrothersInLawRelationship(people);
  });

  describe("Spouse's Brothers", () => {
    beforeEach(() => {
      const grandmother: Person = {
        name: "Grandmother",
        gender: "Female",
        children: [],
      };

      const brother1: Person = {
        name: "Brother1",
        gender: "Male",
        mother: grandmother,
        children: [],
      };
      const brother2: Person = {
        name: "Brother2",
        gender: "Male",
        mother: grandmother,
        children: [],
      };

      const spouse: Person = {
        name: "Spouse",
        gender: "Female",
        mother: grandmother,
        children: [],
      };

      const person: Person = {
        name: "Person",
        gender: "Male",
        spouse: spouse,
        children: [],
      };

      spouse.spouse = person;

      grandmother.children = [brother1, brother2, spouse];

      people.set("Grandmother", grandmother);
      people.set("Brother1", brother1);
      people.set("Brother2", brother2);
      people.set("Spouse", spouse);
      people.set("Person", person);
    });

    it("should find brothers-in-law through spouse's brothers", () => {
      const person = people.get("Person")!;
      const brothersInLaw = brothersInLawFinder.find(person);

      expect(brothersInLaw).toContain("Brother1");
      expect(brothersInLaw).toContain("Brother2");
      expect(brothersInLaw).toHaveLength(2);
    });
  });

  describe("Siblings' Husbands", () => {
    beforeEach(() => {
      const mother: Person = {
        name: "Mother",
        gender: "Female",
        children: [],
      };

      const sister1: Person = {
        name: "Sister1",
        gender: "Female",
        mother: mother,
        children: [],
      };
      const sisterHusband1: Person = {
        name: "SisterHusband1",
        gender: "Male",
        children: [],
      };
      sister1.spouse = sisterHusband1;
      sisterHusband1.spouse = sister1;

      const sister2: Person = {
        name: "Sister2",
        gender: "Female",
        mother: mother,
        children: [],
      };
      const sisterHusband2: Person = {
        name: "SisterHusband2",
        gender: "Male",
        children: [],
      };
      sister2.spouse = sisterHusband2;
      sisterHusband2.spouse = sister2;

      const person: Person = {
        name: "Person",
        gender: "Male",
        mother: mother,
        children: [],
      };

      mother.children = [sister1, sister2, person];

      people.set("Mother", mother);
      people.set("Sister1", sister1);
      people.set("Sister2", sister2);
      people.set("SisterHusband1", sisterHusband1);
      people.set("SisterHusband2", sisterHusband2);
      people.set("Person", person);
    });

    it("should find brothers-in-law through siblings' husbands", () => {
      const person = people.get("Person")!;
      const brothersInLaw = brothersInLawFinder.find(person);

      expect(brothersInLaw).toContain("SisterHusband1");
      expect(brothersInLaw).toContain("SisterHusband2");
      expect(brothersInLaw).toHaveLength(2);
    });
  });

  describe("Combined Cases", () => {
    beforeEach(() => {
      const spousesMother: Person = {
        name: "SpousesMother",
        gender: "Female",
        children: [],
      };

      const personsMother: Person = {
        name: "PersonsMother",
        gender: "Female",
        children: [],
      };

      const spousesBrother: Person = {
        name: "SpousesBrother",
        gender: "Male",
        mother: spousesMother,
        children: [],
      };

      const sister: Person = {
        name: "Sister",
        gender: "Female",
        mother: personsMother,
        children: [],
      };

      const sisterHusband: Person = {
        name: "SisterHusband",
        gender: "Male",
        children: [],
      };

      const spouse: Person = {
        name: "Spouse",
        gender: "Female",
        mother: spousesMother,
        children: [],
      };

      const person: Person = {
        name: "Person",
        gender: "Male",
        mother: personsMother,
        spouse: spouse,
        children: [],
      };

      spouse.spouse = person;
      sister.spouse = sisterHusband;
      sisterHusband.spouse = sister;

      spousesMother.children = [spousesBrother, spouse];
      personsMother.children = [person, sister];

      people.set("SpousesMother", spousesMother);
      people.set("PersonsMother", personsMother);
      people.set("SpousesBrother", spousesBrother);
      people.set("Sister", sister);
      people.set("SisterHusband", sisterHusband);
      people.set("Spouse", spouse);
      people.set("Person", person);
    });

    it("should find all brothers-in-law from both families", () => {
      const person = people.get("Person")!;
      const brothersInLaw = brothersInLawFinder.find(person);

      expect(brothersInLaw).toContain("SpousesBrother");
      expect(brothersInLaw).toContain("SisterHusband");
      expect(brothersInLaw).toHaveLength(2);
    });
  });

  describe("Edge Cases", () => {
    it("should return empty array for person with no spouse and no siblings", () => {
      const person: Person = {
        name: "Lonely",
        gender: "Male",
        children: [],
      };
      people.set("Lonely", person);

      const brothersInLaw = brothersInLawFinder.find(person);
      expect(brothersInLaw).toHaveLength(0);
    });

    it("should return empty array for person with unmarried siblings", () => {
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

      const sister: Person = {
        name: "Sister",
        gender: "Female",
        mother: mother,
        children: [],
      };

      mother.children = [person, sister];

      people.set("Mother", mother);
      people.set("Person", person);
      people.set("Sister", sister);

      const brothersInLaw = brothersInLawFinder.find(person);
      expect(brothersInLaw).toHaveLength(0);
    });

    it("should handle case where spouse has no mother", () => {
      const person: Person = {
        name: "Person",
        gender: "Male",
        children: [],
      };

      const spouse: Person = {
        name: "Spouse",
        gender: "Female",
        children: [],
      };

      person.spouse = spouse;
      spouse.spouse = person;

      people.set("Person", person);
      people.set("Spouse", spouse);

      const brothersInLaw = brothersInLawFinder.find(person);
      expect(brothersInLaw).toHaveLength(0);
    });
  });
});
