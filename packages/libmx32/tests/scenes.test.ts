import { SceneLoader, SceneSerializer } from '@mxfriend/common';
import { readFile } from 'node:fs/promises';
import { Mixer } from '../src';

test('loads and saves a scene', async () => {
  const originalSceneData = await readFile(__dirname + '/data/example-scene.scn', 'utf-8');

  const loader = new SceneLoader();
  const serializer = new SceneSerializer();
  const mixer = new Mixer();

  loader.load(mixer, originalSceneData);
  const generatedSceneData = serializer.serialize(mixer);

  expect(generatedSceneData).toEqual(originalSceneData);
});
