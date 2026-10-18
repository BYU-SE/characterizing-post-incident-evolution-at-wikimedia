import { fetchGerrit } from "./gerrit.js";
import { fetchPhabricator } from "./phabricator.js";

while(true) {
  /*const gerritMin = 100;
  const gerritMax = 1125077;
  const gerritId = gerritMin + Math.floor(Math.random() * (gerritMax - gerritMin));
  await fetchGerrit(`https://gerrit.wikimedia.org/r/${gerritId}`);*/

  const phabMin = 100;
  const phabMax = 388378;
  const phabId = phabMin + Math.floor(Math.random() * (phabMax - phabMin));
  await fetchPhabricator(`https://phabricator.wikimedia.org/T${phabId}`);
}