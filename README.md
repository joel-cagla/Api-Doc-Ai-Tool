# Api-Doc-Ai-Tool
A simple CLI AI tool for creating API docs.

The tool takes two arguments: 
1) The pathname of your directory containing your source code files. 
2) The name of your output file, including the extension. This argument uses the -o flag (I.e. -o myOutputFile.md).

### Installation: 

Install [Ollama](https://ollama.com/download) locally on your machine. Ensure the correct ports are open and that Ollama can run locally (This should be taken care of when installing Ollama). If the ports you use to run Ollama on differ from the ones in the source code (localhost:11434) then you must change this in the source code.

Clone repository and install all dependancies with: `npm i`.

### Building and running the tool:
Use `Ollama serve` to start the LLM server if not already running.

Use `npm run build` to build the tool. Also run this command after making any changes to the source code before running the tool to ensure that your changes take effect.

To run the tool in your terminal from any location use `npm link`. The tool then runs with this command: `api-doc-gen <path to directory> -o <file name>`.

If you do not wish to use `npm link`, the tool can be run via `node dist/cli.js <path to directory> -o <file name>`

Provided all dependancies and pre-requisites are installed and the ports you are using do not differ from the default, this tool should work out of the box.
