# Api-Doc-Ai-Tool
A simple CLI AI tool for creating API docs.

The tool currently extracts functions, async functions, and classes from source code files within the provided directory.

The tool takes only one argument and some options which can be specified with flags.

### Arguments:
1) The pathname of your directory containing your source code files. I.e (/Users/MyUser/Documents/SourceFilesFolder)

### Options:

1) ```-o``` specifies the name of your output file, including the extension. (I.e. -o myOutputFile.md).
2) ```-f``` or ```--functions``` extracts functions only from source files
3) ```-af``` or ```--asyncfunctions``` extracts only async functions from source files.
4) ```-c``` or ```--classes``` extracts only classes from source files.
5) ```-odir``` or ```--outdir``` specifies the directory to write the output file to. If the directory does not exist it will be created. (I.e. -odir ./myFiles/directory-to-write-to).
6) ```--help``` shows usage of and all arugments and options for the tool.

For option #1 if no option is specified, the output file name will default to 'Api-doc.md'. For option #5 if no directory is specified it will write to the local directory that the tool is run from.

For all other options, if no option is specified all symbols are extracted.

### Installation: 

Install [Ollama](https://ollama.com/download) locally on your machine. Ensure the correct ports are open and that Ollama can run locally (This should be taken care of when installing Ollama). If the ports you use to run Ollama on differ from the ones in the source code (localhost:11434) then you must change this in the source code.

Clone repository and install all dependancies. 

Obviously you must install Python (Python3 or the latest version if compatible) first. 
The recommended way to install project dependancies in Python is to use to use ```pip``` and follow these steps: 

1) Install a virtualenv with: ```pip install virtualenv```.
2) Create a virtual environment in your project directory with ```python3 -m venv env```.
3) Activate the environment with ```source env/bin/activate```.
4) Finally, install dependancies with ```pip install -r requirements.txt```.

You may also set up your project in whatever way you would like, then install the packages individually with pip. 

### Building and running the tool:
Use `Ollama serve` to start the LLM server if not already running.

The tool can be run with ```python3 main.py <path to directory> -o <output file name> <optional flag (-f,-af,-c)>```

To run the tool in your terminal from any location it is reccommended to follow these steps: 

1) Give the script file executable rights: ```chmod +x main.py```
2) You may optionally rename the file to whatever you would like to run it as in the terminal. For example: ```mv main.py python-api-doc-gen```. This allows you to run the script in the terminal with ```python-api-doc-gen <arguments and flags>```.
3) Move the script to somewhere on your $PATH. For example: ```sudo mv python-api-doc-gen /usr/local/bin```

You can now run the tool from anywhere in the terminal.

You may also install the tool like a Python package with pip, but this is not reccommended as it requires you to configure the system Python to use for the tool and install to a location that is not ususally globally available. 

Provided all dependancies and pre-requisites are installed and the ports you are using do not differ from the default, this tool should work out of the box.
