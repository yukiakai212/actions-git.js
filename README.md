# @yukiakai/actions-git

> Lightweight Git client for GitHub Actions and CI workflows.

A small, promise-based wrapper around `git` built for automation workflows such as:

- Deploy actions
- Artifact publishing
- Docs deployment
- CI synchronization
- Temporary repository workflows

Designed to be:
- Minimal
- Predictable
- CI-friendly
- Easy to test

---

## Features

- Shallow clone with automatic fallback
- Branch existence detection
- Orphan branch support
- Workspace wipe utilities
- Simple commit/push workflow
- Promise-based API
- TypeScript support
- Designed for GitHub Actions

---

## Installation

```bash
npm install @yukiakai/actions-git
```

---

## Example

```ts
import { GitClient } from '@yukiakai/actions-git';

const git = new GitClient({
  repo: 'owner/repo',
  token: process.env.GITHUB_TOKEN!,
  branch: 'gh-pages',
  cwd: './.deploy',
});

await git.clone();

await git.setup();

await git.checkout();

await git.wipe(['.']);

await git.add(['dist']);

if (await git.hasChanges()) {
  await git.commit('deploy: update docs');

  await git.push();
}
```

---

## API

### `new GitClient(options)`

Creates a new Git client instance.

```ts
type GitOptions = {
  repo: string;
  token: string;
  branch: string;
  cwd: string;
};
```

---

# Methods

## `clone()`

Clone the repository into the target working directory.

Attempts shallow clone first:

```bash
git clone --depth=1 --branch <branch>
```

Falls back to full clone if shallow clone fails.

---

## `setup()`

Configure git identity for CI environments.

Sets:

```bash
user.name  = github-actions[bot]
user.email = github-actions[bot]@users.noreply.github.com
```

---

## `checkout()`

Checkout the target branch.

Behavior:

- If the branch exists:
  - `git checkout <branch>`

- If the branch does not exist:
  - creates orphan branch
  - wipes working tree

---

## `wipe(patterns)`

Remove tracked and untracked files from the working tree.

```ts
await git.wipe(['.']);
```

Internally runs:

```bash
git rm -r -f --ignore-unmatch
git clean -fdx
```

Useful for deployment workflows where the workspace must be fully reset.

---

## `pullRebase()`

Run:

```bash
git pull --rebase origin <branch>
```

---

## `add(patterns)`

Stage files.

```ts
await git.add(['dist', 'package.json']);
```

---

## `commit(message)`

Create a commit.

```ts
await git.commit('deploy: update docs');
```

---

## `push()`

Push the current branch to origin.

```ts
await git.push();
```

---

## `hasChanges()`

Check whether staged changes exist.

```ts
const changed = await git.hasChanges();
```

Uses:

```bash
git diff --cached --quiet
```

Returns:
- `true` → changes exist
- `false` → no changes

---

## Use Cases

- GitHub Actions
- Documentation deployment
- Artifact deployment
- Monorepo publishing
- Static site deployment
- CI repository sync

---

## License

MIT Yuki Akai
