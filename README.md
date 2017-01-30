# ng2-shortcuts README

This simple Angular 2 productivity VSCode extension tries to mimic the behaviour of the Visual Studio F7 key which by default switches to the 'code-behind' of a layout page (typically in web forms).

## Features

Will keybind the F7 key to automatically read the @Component decorator of an opened .ts component file, and read the templateUrl property if it exists, and open the equivalent template .html (typically residing in the same folder) in a seperate tab while keeping the .ts file open. 

Pressing F7 from the .html template file will simply open the .ts file in the same folder with the following priority: <br>
1- If the file has the same name <br>
2- If there is only 1 .ts file in the same folder <br>
3- If there are multiple files, opt the user to select which to open (using VSCode's QuickPick) *currenty selecting from list does nothing* <br>

## Upcoming Features

The priority logic will be further updated to include:

4- If there are multiple files, open the one with a @Component decorator <br>
OR <br>
4- If there are multiple files, either opt the user to select which (using VSCode's QuickPick) <br>
OR <br>
4- If there are multiple files, try to eliminate which are not relevant and revert to logic point #3 <br>

This is a bit of an overkill, as a typical Angular 2 component is usually structured in a single folder with 1 .ts file having a @Component decorator (same applies for Ionic 2 Pages).

### 1.0.0

Initial release
