const express = require("express");
const morgan = require("morgan")
const app = express();
const cors = require('cors')
app.use(cors())


app.use(express.json());

morgan.token('dataSent', (req, res) =>{
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dataSent'))

app.use(express.static('build'))

let persons = [
  {
    id: 1,
    name: "Mia Clara",
    number: "4165345833",
  },
  {
    id: 2,
    name: "Hector Clara",
    number: "4165345833",
  },
  {
    id: 3,
    name: "Janella Clara",
    number: "44162093971",
  },
  {
    id: 4,
    name: "Mateo Clara",
    number: "4165555555",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello People!</h1>");
});

app.get("/info", (req, res) => {
  const date = new Date();

  res.send(`Phonebook has info for ${persons.length} people
${date}
`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateRandomId = () => {
  return Math.floor(Math.random() * 1000);
};

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name || !person.number) {
    return res.status(404).json({
      error: "missing information",
    });
  } else if (persons.some((per) => per.name === person.name)) {
    return res.status(404).json({
      error: "Name must be unique",
    });
  }

  const personToAdd = {
    name: person.name,
    number: person.number,
    id: generateRandomId(),
  };
  persons = persons.concat(personToAdd);
  res.json(personToAdd);
});



const PORT = process.env.PORT ||3001;

app.listen(PORT, () => {
  console.log(`Server online running on PORT:${PORT}`);
});
