// https://github.com/storybookjs/storybook/issues/29567
import base from 'config-storybook';

// Merge base config and append this app's static directory so /assets/... works
const merged = {
    ...base,
    staticDirs: [...(base.staticDirs ?? []), '../static'],
};

export default merged as typeof base;
