require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const singersRouter = require("./routes/singers");
const songsRouter = require("./routes/songs");
const slipsRouter = require("./routes/slips");
const cors = require("cors");
const helmet = require("helmet");

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(cors({
	origin: 'http://localhost:4200'
}))
app.use(helmet());

app.get("/", (req, res) => {
	res.json({ message: "ok" });
});

app.use("/singers", singersRouter);
app.use("/songs", songsRouter);
app.use("/slips", slipsRouter);


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