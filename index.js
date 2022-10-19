require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const singersRouter = require("./routes/singers");
const songsRouter = require("./routes/songs");
const slipsRouter = require("./routes/slips");
const sessionsRouter = require("./routes/sessions");

//cors is middleware to help with...cors
const cors = require("cors");

//Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require("helmet");

//body-parser is middleware to parse incoming request bodies before handlers - req.body propery
const bodyParser = require('body-parser');

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(cors({
	origin: process.env.ORIGIN
}))

app.use(helmet());

app.get("/", (req, res) => {
	res.json({ message: "ok" });
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/singers", singersRouter);
app.use("/songs", songsRouter);
app.use("/slips", slipsRouter);
app.use("/sessions", sessionsRouter);


/* Error handler middleware */
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	console.error(err.message, err.stack);
	res.status(statusCode).json({ message: err.message });
	return;
})

app.listen(port, () => {
	console.log(`karaoke-q-api app listening at http://localhost:${port}`);
});