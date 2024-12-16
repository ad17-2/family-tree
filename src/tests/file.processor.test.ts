import * as fs from "fs";
import * as path from "path";
import { processFile } from "../processors/file.processor";

describe("File Processor", () => {
  let testFilePath: string;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    testFilePath = path.join(__dirname, "test-input.txt");
    consoleLogSpy = jest.spyOn(console, "log");
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    consoleLogSpy.mockRestore();
  });

  it("should process family initialization correctly", async () => {
    const input = "INIT_FAMILY Queen-Margret Female King-Arthur Male";
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    expect(consoleLogSpy).toHaveBeenCalledWith("FAMILY_INITIALIZED");
  });

  it("should process adding child correctly", async () => {
    const input = `INIT_FAMILY Queen-Margret Female King-Arthur Male
ADD_CHILD Queen-Margret Bill Male`;
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    expect(consoleLogSpy).toHaveBeenCalledWith("CHILD_ADDED");
  });

  it("should process adding person correctly", async () => {
    const input = "ADD_PERSON Flora Female";
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    expect(consoleLogSpy).toHaveBeenCalledWith("PERSON_ADDED");
  });

  it("should process adding spouse correctly", async () => {
    const input = `ADD_PERSON Flora Female
ADD_PERSON Ted Male
ADD_SPOUSE Flora Ted`;
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    expect(consoleLogSpy).toHaveBeenCalledWith("SPOUSE_ADDED");
  });

  it("should process get relationship correctly", async () => {
    const input = `INIT_FAMILY Queen-Margret Female King-Arthur Male
ADD_CHILD Queen-Margret Bill Male
ADD_CHILD Queen-Margret Flora Female
GET_RELATIONSHIP Bill Siblings`;
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    // The last console.log should be the siblings
    expect(consoleLogSpy).toHaveBeenCalledWith("Flora");
  });

  it("should handle complex family scenario", async () => {
    const input = `INIT_FAMILY Queen-Margret Female King-Arthur Male
ADD_CHILD Queen-Margret Bill Male
ADD_CHILD Queen-Margret Flora Female
ADD_PERSON Ted Male
ADD_SPOUSE Flora Ted
ADD_CHILD Flora Victoire Female
ADD_CHILD Flora Dominique Female
GET_RELATIONSHIP Flora Daughter
GET_RELATIONSHIP Bill Sister-In-Law`;
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    // Check for Victoire and Dominique as Flora's daughters
    const calls = consoleLogSpy.mock.calls.map((call) => call[0]);
    expect(calls).toContain("Victoire Dominique");
  });

  it("should handle invalid mother for child addition", async () => {
    const input = "ADD_CHILD NonExistentMother Child Female";
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    expect(consoleLogSpy).toHaveBeenCalledWith("PERSON_NOT_FOUND");
  });

  it("should handle adding child through father", async () => {
    const input = `INIT_FAMILY Queen-Margret Female King-Arthur Male
ADD_CHILD King-Arthur Child Female`;
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    expect(consoleLogSpy).toHaveBeenCalledWith("CHILD_ADDITION_FAILED");
  });

  it("should handle relationship query for non-existent person", async () => {
    const input = "GET_RELATIONSHIP NonExistentPerson Siblings";
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    expect(consoleLogSpy).toHaveBeenCalledWith("PERSON_NOT_FOUND");
  });

  it("should handle invalid command format", async () => {
    const input = "INIT_FAMILY Invalid Command Format";
    fs.writeFileSync(testFilePath, input);

    await processFile(testFilePath);

    // Should not throw error but also not process the command
    expect(consoleLogSpy).not.toHaveBeenCalledWith("FAMILY_INITIALIZED");
  });
});
