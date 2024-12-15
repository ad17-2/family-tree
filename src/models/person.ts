import { Gender } from "../types/gender.type";

export interface Person {
  name: string;
  gender: Gender;
  spouse?: Person;
  children: Person[];
  mother?: Person;
  father?: Person;
}
