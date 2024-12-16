import { FamilyTree } from "../facade/family-tree";

describe("FamilyTree", () => {
  let familyTree: FamilyTree;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    familyTree = new FamilyTree();
    consoleLogSpy = jest.spyOn(console, "log");
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("addPerson", () => {
    it("should successfully add a person", () => {
      const person = familyTree.addPerson("John", "Male");
      expect(person).toBeTruthy();
      expect(consoleLogSpy).toHaveBeenCalledWith("PERSON_ADDED");
    });

    it("should not add duplicate person", () => {
      familyTree.addPerson("John", "Male");
      const duplicatePerson = familyTree.addPerson("John", "Male");
      expect(duplicatePerson).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith("DUPLICATE_PERSON");
    });
  });

  describe("initializeFamily", () => {
    it("should initialize a family with two people", () => {
      familyTree.initializeFamily("Mother", "Female", "Father", "Male");
      expect(consoleLogSpy).toHaveBeenCalledWith("FAMILY_INITIALIZED");
    });

    it("should not initialize family with same gender", () => {
      familyTree.initializeFamily("Person1", "Male", "Person2", "Male");
      expect(consoleLogSpy).toHaveBeenCalledWith("INVALID_SPOUSE");
    });
  });

  describe("addChild", () => {
    beforeEach(() => {
      familyTree.initializeFamily("Mother", "Female", "Father", "Male");
    });

    it("should add child through mother", () => {
      const child = familyTree.addChild("Mother", "Child", "Female");
      expect(child).toBeTruthy();
      expect(consoleLogSpy).toHaveBeenCalledWith("CHILD_ADDED");
    });

    it("should not add child through father", () => {
      const child = familyTree.addChild("Father", "Child", "Female");
      expect(child).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith("CHILD_ADDITION_FAILED");
    });

    it("should not add child for non-existent mother", () => {
      const child = familyTree.addChild("NonExistent", "Child", "Female");
      expect(child).toBeNull();
      expect(consoleLogSpy).toHaveBeenCalledWith("PERSON_NOT_FOUND");
    });
  });

  describe("addSpouse", () => {
    beforeEach(() => {
      familyTree.addPerson("Person1", "Male");
      familyTree.addPerson("Person2", "Female");
    });

    it("should add spouse successfully", () => {
      familyTree.addSpouse("Person1", "Person2");
      expect(consoleLogSpy).toHaveBeenCalledWith("SPOUSE_ADDED");
    });

    it("should not add spouse if already married", () => {
      familyTree.addSpouse("Person1", "Person2");
      familyTree.addPerson("Person3", "Female");
      familyTree.addSpouse("Person1", "Person3");
      expect(consoleLogSpy).toHaveBeenCalledWith("ALREADY_MARRIED");
    });
  });

  describe("getRelationship", () => {
    beforeEach(() => {
      familyTree.initializeFamily("Mother", "Female", "Father", "Male");
      familyTree.addChild("Mother", "Child1", "Female");
      familyTree.addChild("Mother", "Child2", "Male");

      familyTree.addPerson("Spouse1", "Male");
      familyTree.addSpouse("Child1", "Spouse1");
    });

    it("should find siblings", () => {
      const siblings = familyTree.getRelationship("Child1", "Siblings");
      expect(siblings).toContain("Child2");
    });

    it("should find maternal aunt", () => {
      familyTree.addChild("Child1", "Grandchild", "Female");
      const maternalAunts = familyTree.getRelationship(
        "Grandchild",
        "Maternal-Aunt"
      );
      expect(maternalAunts).toHaveLength(0);
      expect(consoleLogSpy).toHaveBeenCalledWith("NONE");
    });

    it("should find sons", () => {
      const sons = familyTree.getRelationship("Mother", "Son");
      expect(sons).toContain("Child2");
    });

    it("should find daughters", () => {
      const daughters = familyTree.getRelationship("Mother", "Daughter");
      expect(daughters).toContain("Child1");
    });

    it("should handle non-existent person", () => {
      const result = familyTree.getRelationship("NonExistent", "Siblings");
      expect(result).toHaveLength(0);
      expect(consoleLogSpy).toHaveBeenCalledWith("PERSON_NOT_FOUND");
    });
  });

  describe("Complex Family Relationships", () => {
    beforeEach(() => {
      familyTree.initializeFamily(
        "Grandmother",
        "Female",
        "Grandfather",
        "Male"
      );
      familyTree.addChild("Grandmother", "Mother", "Female");
      familyTree.addChild("Grandmother", "Aunt", "Female");
      familyTree.addChild("Grandmother", "Uncle", "Male");

      familyTree.addPerson("Father", "Male");
      familyTree.addSpouse("Mother", "Father");

      familyTree.addChild("Mother", "Child", "Female");
      familyTree.addChild("Aunt", "Cousin", "Male");
    });

    it("should find maternal aunts", () => {
      const aunts = familyTree.getRelationship("Child", "Maternal-Aunt");
      expect(aunts).toContain("Aunt");
    });

    it("should find maternal uncles", () => {
      const uncles = familyTree.getRelationship("Child", "Maternal-Uncle");
      expect(uncles).toContain("Uncle");
    });

    it("should find cousins as siblings", () => {
      const siblings = familyTree.getRelationship("Child", "Siblings");
      expect(siblings).not.toContain("Cousin");
    });

    it("should handle in-law relationships", () => {
      familyTree.addPerson("Spouse", "Male");
      familyTree.addSpouse("Child", "Spouse");

      const brothersInLaw = familyTree.getRelationship(
        "Mother",
        "Brother-In-Law"
      );
      expect(brothersInLaw).toBeTruthy();
    });
  });
});
