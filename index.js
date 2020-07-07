require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :dataSent"
  )
);

morgan.token("dataSent", (req, res) => {
  return JSON.stringify(req.body);
});

//RESTFUL BEGINS HERE

app.get("/", (req, res) => {
  res.send("<h1>Hello People!</h1>");
});

app.get("/info", (req, res) => {
  const date = new Date();

  Person.countDocuments({}, (err, count) => {
    res.send(`Phonebook has info for ${count} people
${date}
`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const person = req.body;

  const personToAdd = new Person({
    name: person.name,
    number: person.number,
  });

  personToAdd
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => res.json(savedAndFormattedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = req.body;
  const id = req.params.id;

  const personToUpdate = {
    name: person.name,
    number: person.number,
  };

  Person.findByIdAndUpdate(id, personToUpdate)
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Middleware is here

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server online running on PORT:${PORT}`);
});
