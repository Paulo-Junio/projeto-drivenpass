import app, { init } from "./index.js";


const port = +process.env.PORT || 4000;

init().then(() => {
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${port}.`);
  });
});