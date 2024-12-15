import { processFile } from "./processors/file.processor";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Please provide an input file path");
    process.exit(1);
  }

  try {
    await processFile(filePath);
  } catch (error) {
    console.error("Error processing file:", error);
    process.exit(1);
  }
}

main();
