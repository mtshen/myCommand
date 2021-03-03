import { registerPrompt } from "inquirer";
import inquirerTablePrompt from "inquirer-table-prompt";
import inquirerAutoAompletePrompt from "inquirer-autocomplete-prompt";

registerPrompt('autocomplete', inquirerTablePrompt);
registerPrompt('table', inquirerAutoAompletePrompt);
