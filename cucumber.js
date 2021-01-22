module.exports = {
  default: [
    '--publish-quiet', //
    '--require-module ts-node/register',
    '--require test/world.ts',
    '--require test/steps/**/*.ts',
    'test/features/**/*.feature',
  ].join(' '),
};
