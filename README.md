# tableview-workbench

A Noctua Workbench to allow entry and viewing of models in a tabular format

### Known Issues

- The workbench fails to load properly when the user is not logged into Noctua.
- Summary rows for the Annoton *groups* need to display more information.
- Save does not work yet.
- Changes to the model from within Noctua's graph editor are not reflected dynamically in the table view.

### How to Build

This creates the required workbench files in `workbenches/tableview-workbench/` that will be loaded by Noctua when the workbench is invoked.

```bash
npm install
npm run build
```

### How to configure Noctua

Edit Noctua's local `startup.yaml` file to add TableView's `workbenches` directory, and restart Noctua. For example, here is a fragment of a `startup.yaml` that has been configured:

```yaml
WORKBENCHES:
  comment: The location of workbench directories to add to the configuration.
  type: list
  value:
    - 'workbenches'
    - '../tableview-workbench/workbenches'
```

### How to Dev

During development, while editing TableView code, you can use the following command to *watch* your source files and rebuild quickly as you change them.

```bash
npm run dev
```
