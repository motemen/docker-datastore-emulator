import fetch from 'node-fetch';
import * as fs from 'fs';
import * as core from '@actions/core';
import semverValid = require('semver/functions/valid');
import semverCompare = require('semver/functions/compare');

// possible options
// - files
// - image
// - bumpType: next, max, keep-major, keep-minor,

(async () => {
  try {
    const file = 'Dockerfile';
    const dockerfileContent = fs.readFileSync(file).toString('utf-8');
    const m = /^FROM ([^:]+):([0-9.]+)((?:-\S+)?)/m.exec(dockerfileContent); // FIXME
    if (!m) {
      throw new Error(`Could not find FROM instruction from ${file}`);
    }

    const [, image, tag, variant] = m;
    const hubImage = image.indexOf('/') === -1 ? `library/${image}` : image;

    core.debug(`hubImage=${hubImage}; tag=${tag}`);

    const authTokenResp = await fetch(
      `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${hubImage}:pull`
    ).then(resp => resp.json());
    const authToken = authTokenResp['token'];

    const tagsResp: any = await fetch(
      `https://registry.hub.docker.com/v2/${hubImage}/tags/list`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then(resp => resp.json());

    if (tagsResp.errors) {
      throw new Error(`Fetching tags: ${JSON.stringify(tagsResp.errors)}`);
    }

    const tags: string[] = tagsResp['tags'].filter(semverValid);
    tags.sort(semverCompare);

    core.debug(`tags sorted: ${tags}`);

    const index = tags.indexOf(tag);
    const nextTag = tags[index + 1];
    core.debug(`nextTag: ${nextTag}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
