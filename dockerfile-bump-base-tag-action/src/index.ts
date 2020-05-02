import fetch from 'node-fetch';
import * as fs from 'fs';
import * as core from '@actions/core';
import semverCompare = require('semver/functions/compare');

// possible options
// - files
// - image
// - bumpType: next, max, keep-major, keep-minor,

(async () => {
  try {
    const file = 'Dockerfile';
    const dockerfileContent = fs.readFileSync(file).toString('utf-8');
    const m = /^FROM ([^:]+):(\S+)/m.exec(dockerfileContent); // FIXME
    if (!m) {
      throw new Error(`Could not find FROM instruction from ${file}`);
    }

    const [image, tag] = m;
    const hubImage = '/'.indexOf(image) === -1 ? `library/${image}` : image;

    const authTokenResp = await fetch(
      `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${hubImage}:pull`
    ).then(resp => resp.json());
    const authToken = authTokenResp['token'];

    const tagsResp = await fetch(
      `https://registry.hub.docker.com/v2/${hubImage}/tags/list`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    ).then(resp => resp.json());

    const tags: string[] = tagsResp['tags'];
    core.debug(`tags: ${tags}`);
    tags.sort(semverCompare);
    core.debug(`tags sorted: ${tags}`);
    const index = tags.indexOf(tag);
    const nextTag = tags[index+1];
    core.debug(`nextTag: ${nextTag}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
