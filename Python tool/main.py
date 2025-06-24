import ast
import os
import sys
import requests

def extract_symbols_from_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        source = file.read()
    tree = ast.parse(source, filename=file_path)

    symbols = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            start_line = node.lineno - 1
            end_line = node.body[-1].lineno
            code_lines = source.splitlines()[start_line:end_line]
            code = "\n".join(code_lines)

            symbols.append({
                "name": node.name,
                "code": code,
                "file": os.path.basename(file_path)
            })

    return symbols

def extract_symbols_from_directory(directory):
    print("Extracting from directory: ", directory)
    all_symbols = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                symbols = extract_symbols_from_file(path)
                all_symbols.extend(symbols)
    return all_symbols

def generate_api_docs(symbols):
    symbol_code = ""
    for symbol in symbols:
        symbol_code += f"# File: {symbol['file']}\n{symbol['code']}\n\n"
    prompt = f"You are a technical writer. You will be given Python source code. You may be given the source code for a number symbols either separately or all together. Create concise and clear REST-style API documentation for all of the source code you receive. If you only recieve one type of symbol, only produce documnetation for that symbol. For example, if you only receive source code for functions, only create documentation for those functions.Each source code block is labeled with the file it comes from. Group the documentation under each file name. Source code blocks with the same file name must be grouped together. Separate the different types of symbols and group them into separate sections. Do not include any pleasantries or any writing other than the documentation itself. Source code: ${symbol_code}"
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False}
    )
    result = response.json()
    return result.get("response", "")

def write_to_file(output, filename="Api-doc.md"):
    with open(filename, "w", encoding="utf-8") as file: 
        file.write(output)

def main(directory_path):
    symbols = extract_symbols_from_directory(directory_path)

    if not symbols:
        print('No symbols found')
        return
    
    documentation = generate_api_docs(symbols)
    if documentation:
        write_to_file(documentation)
        print("Documentation written")
    else:
        print("No documentation generated")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 main.py <path to source code directory>")
    else:
        main(sys.argv[1])
    
