Run the command `npm run scaffold` to run the scaffolding for this project.

```
npm run scaffold
```

This will make sure the scaffolding dependencies are installed and prompt 
you as to which scaffold you would like to run. This simply reads
the names of the scaffold directories under `scaffold/scaffolds`, you can
feel free to modify the existing scaffold templates or create new scaffolds 
using another scaffold as a basis. 

The scaffolding makes use of two basic dependencies: [Inquirer](https://github.com/sboudrias/Inquirer.js) 
for question prompting and [Assemble](https://github.com/assemble/assemble) for assembling and
copying template files.