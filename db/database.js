import nedb from "nedb-promises";
import path from "path";
import { fileURLToPath } from "url";

// Path to databases
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Names of databases
const database_names = ["company", "order", "users", "completedOrder", "menu", "campaigns"];
const db = {};

// Create databases
database_names.forEach((name) => {
  const database_directory = path.join(dirname, `${name}.db`);
  db[name] = new nedb({
    filename: database_directory,
    autoload: true,
  });
});

export default db;
