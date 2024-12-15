import { FamilyTreeErrorCode } from "./family-tree.error.enum";

export class FamilyTreeError extends Error {
  constructor(
    public readonly code: FamilyTreeErrorCode | string,
    message: string
  ) {
    super(message);
    this.name = "FamilyTreeError";
    Object.setPrototypeOf(this, FamilyTreeError.prototype);
  }
}
