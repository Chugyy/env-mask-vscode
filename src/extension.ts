import * as vscode from 'vscode';

const ENV_VALUE_REGEX = /^([A-Z_][A-Z0-9_]*)=(.+)$/gm;
let maskDecoration: vscode.TextEditorDecorationType;
let isEnabled = true;

export function activate(context: vscode.ExtensionContext) {
  maskDecoration = vscode.window.createTextEditorDecorationType({
    after: {
      contentText: '••••••',
      color: new vscode.ThemeColor('editorLineNumber.foreground')
    },
    textDecoration: 'none; opacity: 0'
  });

  const config = vscode.workspace.getConfiguration('envMask');
  isEnabled = config.get('enabled', true);

  const toggleCommand = vscode.commands.registerCommand('env-mask.toggle', () => {
    isEnabled = !isEnabled;
    vscode.window.showInformationMessage(`ENV Mask: ${isEnabled ? 'Enabled' : 'Disabled'}`);
    updateAllEditors();
  });

  const activeEditorChange = vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) applyMask(editor);
  });

  const documentChange = vscode.workspace.onDidChangeTextDocument(event => {
    const editor = vscode.window.activeTextEditor;
    if (editor && event.document === editor.document) {
      applyMask(editor);
    }
  });

  const selectionChange = vscode.window.onDidChangeTextEditorSelection(event => {
    applyMask(event.textEditor);
  });

  context.subscriptions.push(
    maskDecoration,
    toggleCommand,
    activeEditorChange,
    documentChange,
    selectionChange
  );

  if (vscode.window.activeTextEditor) {
    applyMask(vscode.window.activeTextEditor);
  }
}

function applyMask(editor: vscode.TextEditor) {
  if (!isEnabled || !isEnvFile(editor.document)) {
    editor.setDecorations(maskDecoration, []);
    return;
  }

  const config = vscode.workspace.getConfiguration('envMask');
  const unmaskActiveLine = config.get('unmaskActiveLine', true);
  const activeLine = editor.selection.active.line;

  const ranges: vscode.DecorationOptions[] = [];
  const text = editor.document.getText();
  let match: RegExpExecArray | null;

  ENV_VALUE_REGEX.lastIndex = 0;

  while ((match = ENV_VALUE_REGEX.exec(text)) !== null) {
    const line = editor.document.positionAt(match.index).line;

    if (unmaskActiveLine && line === activeLine) {
      continue;
    }

    const keyLength = match[1].length + 1; // key + '='
    const valueStart = match.index + keyLength;
    const valueEnd = match.index + match[0].length;

    const startPos = editor.document.positionAt(valueStart);
    const endPos = editor.document.positionAt(valueEnd);

    ranges.push({ range: new vscode.Range(startPos, endPos) });
  }

  editor.setDecorations(maskDecoration, ranges);
}

function isEnvFile(document: vscode.TextDocument): boolean {
  const fileName = document.fileName.toLowerCase();
  return fileName.endsWith('.env') ||
         fileName.includes('.env.') ||
         document.languageId === 'properties' ||
         document.languageId === 'dotenv';
}

function updateAllEditors() {
  vscode.window.visibleTextEditors.forEach(editor => applyMask(editor));
}

export function deactivate() {}
