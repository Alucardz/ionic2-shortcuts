'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.openPageComponent', () => {
        // The code you place here will be executed every time your command is executed
        let fileName: string = vscode.window.activeTextEditor.document.fileName;
        let fileNameArr: string[] = fileName.split("\\");
        let fileDir: string = fileNameArr.slice(0, fileNameArr.length - 1).join("\\");
        let fileNameToOpen: string;

        //if an .html file is open, simply open the equivalent .ts, or if not found open the .ts (multiple?) in the same folder
        if (fileName.endsWith(".html")) {
            fileNameToOpen = fileName.replace(".html", ".ts")
            if (!fs.existsSync(fileNameToOpen)) {
                let filesInDir: string[] = fs.readdirSync(fileDir);
                let tsFilesInDir: string[] = [];
                //look for all .ts files in dir
                filesInDir.forEach(filePath => {
                    if (filePath.endsWith(".ts")) {
                        tsFilesInDir.push(filePath);
                    }
                });

                //if only 1 is found, chose it to be opened
                if (tsFilesInDir.length === 1) {
                    fileNameToOpen = fileDir + "\\" + tsFilesInDir[0];
                } else {
                    //todo: multiple files?
                    vscode.window.showQuickPick(tsFilesInDir, {
                        placeHolder: "Multiple .ts files where found:",
                        onDidSelectItem: (item) => {
                            //openFile(fileDir + "\\" + item);
                        }
                    });
                }
            }
        } else if (fileName.endsWith(".ts")) {
            let text: string = vscode.window.activeTextEditor.document.getText(new vscode.Range(0, 0, vscode.window.activeTextEditor.document.lineCount, 0))
            //seek out Component metadata options
            let compParams: string = text.substring(text.indexOf("@Component({") + 11, text.indexOf("})") + 1);

            //Make sure it exists (empty files, etc...)
            if ((compParams !== "") && compParams.startsWith("{") && (compParams.endsWith("}"))) {
                let compParamsObj = JSON.parse(JSONize(compParams));
                //read templateUrl
                if (compParamsObj.templateUrl) {
                    fileNameToOpen = fileName.replace(fileNameArr.pop(), compParamsObj.templateUrl);
                } else { //if not found, just revert to opening html file of same name                    
                    fileNameToOpen = fileName.replace(".ts", ".html")
                }
            }
        }
        openFile(fileNameToOpen);

    });
    context.subscriptions.push(disposable);

}

function openFile(fileNameToOpen: string) {
    if ((fileNameToOpen !== "") && (fs.existsSync(fileNameToOpen))) {
        vscode.commands.executeCommand("vscode.open", vscode.Uri.file(fileNameToOpen)).then(() => {

        });
    }
}

function JSONize(str) {
    return str
        // wrap keys without quote with valid double quote
        .replace(/([\$\w]+)\s*:/g, (_, $1) => { return '"' + $1 + '":' })
        // replacing single quote wrapped ones to double quote 
        .replace(/'([^']+)'/g, (_, $1) => { return '"' + $1 + '"' })
}

// this method is called when your extension is deactivated
export function deactivate() {
}