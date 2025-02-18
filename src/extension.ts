import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.previewInlineSvg', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const selectedText = editor.document.getText(editor.selection);
      const svgContent = extractSvg(selectedText); // 提取行内 SVG

      const panel = vscode.window.createWebviewPanel(
        'svgPreview',
        'SVG Preview',
        vscode.ViewColumn.Beside,
        {}
      );

      panel.webview.html = getWebviewContent(svgContent);
    }
  });

  context.subscriptions.push(disposable);
}

/**
 * 从给定的文本中提取 SVG 代码。
 * 
 * @param text - 包含 SVG 代码的文本。
 * @returns 提取到的 SVG 代码，如果未找到则返回空字符串。
 */
function extractSvg(text: string): string {
  // 使用正则表达式匹配 SVG 标签及其内容
  const match = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  // 如果匹配成功，返回匹配到的 SVG 代码，否则返回空字符串
  return match ? match[0] : '';
}

function getWebviewContent(svg: string): string {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SVG Preview</title>
      <style>
          body{
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: transparent;
          }
          svg{
            width: 50%;
            height: 50%;
          }
      </style>
  </head>
  <body>
      ${svg}
  </body>
  </html>`;
}



