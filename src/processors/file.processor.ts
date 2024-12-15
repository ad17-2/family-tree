import * as fs from "fs";
import * as readline from "readline";
import { FamilyTree } from "../facade/family-tree";
import { Gender } from "../types/gender.type";
import { RelationshipType } from "../types/relationship.type";

export async function processFile(filePath: string): Promise<void> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const tree = new FamilyTree();

  for await (const line of rl) {
    const [command, ...args] = line.split(" ");

    switch (command) {
      case "INIT_FAMILY":
        if (args.length === 4) {
          const [person1Name, person1Gender, person2Name, person2Gender] = args;
          tree.initializeFamily(
            person1Name,
            person1Gender as Gender,
            person2Name,
            person2Gender as Gender
          );
        }
        break;

      case "ADD_PERSON":
        if (args.length === 2) {
          const [name, gender] = args;
          tree.addPerson(name, gender as Gender);
        }
        break;

      case "ADD_CHILD":
        if (args.length === 3) {
          const [motherName, childName, gender] = args;
          tree.addChild(motherName, childName, gender as Gender);
        }
        break;

      case "ADD_SPOUSE":
        if (args.length === 2) {
          const [person1Name, person2Name] = args;
          tree.addSpouse(person1Name, person2Name);
        }
        break;

      case "GET_RELATIONSHIP":
        if (args.length === 2) {
          const [name, relationship] = args;
          const result = tree.getRelationship(
            name,
            relationship as RelationshipType
          );
          if (result.length > 0) {
            console.log(result.join(" "));
          }
        }
        break;
    }
  }
}
