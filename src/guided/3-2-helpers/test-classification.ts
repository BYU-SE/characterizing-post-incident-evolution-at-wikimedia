import { classifyCommitMessage } from "../3-2-metrics-commits.js";
import { currentClassificationKeywords } from "./classification-keywords.js";
import testMessages from "./sample-commit-messages.js";

console.log("Testing commit message classification:\\n");

testMessages.forEach((message, index) => {
  const classification = classifyCommitMessage(message);
  const firstLine = message.split("\\n")[0];

  console.log(`Example ${index + 1}: "${firstLine}"`);
  
  // Dynamically display all classification results
  for (const category of Object.keys(currentClassificationKeywords)) {
    const propertyName = `is${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    console.log(`  ${categoryName}: ${classification[propertyName] || false}`);
  }
  
  console.log();
});
