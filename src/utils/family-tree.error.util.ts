import { FamilyTreeError } from "../errors/family-tree.error";
import { FamilyTreeErrorCode } from "../errors/family-tree.error.enum";

export const Errors = {
  personNotFound: (name: string) =>
    new FamilyTreeError(
      FamilyTreeErrorCode.PERSON_NOT_FOUND,
      `Person ${name} not found`
    ),

  duplicatePerson: (name: string) =>
    new FamilyTreeError(
      FamilyTreeErrorCode.DUPLICATE_PERSON,
      `Person with name ${name} already exists`
    ),

  invalidSpouse: () =>
    new FamilyTreeError(
      FamilyTreeErrorCode.INVALID_SPOUSE,
      "Spouses must be of different genders"
    ),

  alreadyMarried: () =>
    new FamilyTreeError(
      FamilyTreeErrorCode.ALREADY_MARRIED,
      "One or both persons are already married"
    ),

  childAdditionFailed: (reason: string) =>
    new FamilyTreeError(FamilyTreeErrorCode.CHILD_ADDITION_FAILED, reason),

  invalidRelationship: (relationship: string) =>
    new FamilyTreeError(
      FamilyTreeErrorCode.INVALID_RELATIONSHIP,
      `Invalid relationship type: ${relationship}`
    ),
};
