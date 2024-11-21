import { AbstractParser, EnclosingContext } from "../../constants";
import Parser = require("web-tree-sitter");
let parser: Parser;

// Initialize Tree-sitter parser
async function initializeParser() {
  if (!parser) {
    await Parser.init();
    parser = new Parser();
    // You'll need to load the WASM file from your node_modules
    const Lang = await Parser.Language.load('/Users/bleach/Desktop/School/Headstarter/PR Agent/SecureAgent/node_modules/tree-sitter-python/tree-sitter-python.wasm');
    parser.setLanguage(Lang);
  }
  return parser;
}

const processNode = (
  node: Parser.SyntaxNode,
  lineStart: number,
  lineEnd: number,
  largestSize: number,
  largestEnclosingContext: Parser.SyntaxNode | null
) => {
  const startPosition = node.startPosition;
  const endPosition = node.endPosition;
  
  if (startPosition.row <= lineStart && lineEnd <= endPosition.row) {
    const size = endPosition.row - startPosition.row;
    if (size > largestSize) {
      largestSize = size;
      largestEnclosingContext = node;
    }
  }
  return { largestSize, largestEnclosingContext };
};

export class PythonParser implements AbstractParser {
  private async getParser(): Promise<Parser> {
    return await initializeParser();
  }

  async findEnclosingContext(
    file: string,
    lineStart: number,
    lineEnd: number
  ): Promise<EnclosingContext> {
    const parser = await this.getParser();
    const tree = parser.parse(file);
    let largestEnclosingContext: Parser.SyntaxNode = null;
    let largestSize = 0;

    // Traverse the syntax tree to find function and class definitions
    const cursor = tree.walk();
    do {
      const node = cursor.currentNode;
      
      // Check for function definitions and class definitions
      if (
        node.type === 'function_definition' ||
        node.type === 'class_definition'
      ) {
        ({ largestSize, largestEnclosingContext } = processNode(
          node,
          lineStart,
          lineEnd,
          largestSize,
          largestEnclosingContext
        ));
      }
    } while (cursor.gotoNextSibling() || cursor.gotoParent());

    return {
      enclosingContext: largestEnclosingContext,
    } as EnclosingContext;
  }

  async dryRun(file: string): Promise<{ valid: boolean; error: string }> {
    try {
      const parser = await this.getParser();
      const tree = parser.parse(file);
      
      // Check if there are any ERROR nodes in the syntax tree
      let hasError = false;
      const cursor = tree.walk();
      
      do {
        if (cursor.currentNode.type === 'ERROR') {
          hasError = true;
          break;
        }
      } while (cursor.gotoNextSibling() || cursor.gotoParent());

      return {
        valid: !hasError,
        error: hasError ? "Syntax error in Python code" : "",
      };
    } catch (exc) {
      return {
        valid: false,
        error: exc.toString(),
      };
    }
  }
}
