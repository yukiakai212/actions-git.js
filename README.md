# @yukiakai/actions-git

> Lightweight Git client for GitHub Actions and CI workflows.

`@yukiakai/actions-git` prepares a Git repository for automated workflows.

The library handles repository setup for you—including cloning, branch initialization, and Git identity configuration—then returns a repository that is ready to commit and push.

---

# Features

* Ready-to-use Git repository
* Automatic remote branch detection
* Shallow clone with automatic fallback
* Automatic orphan branch initialization
* Configurable Git identity
* Simple staging, commit and push workflow
* Promise-based API
* Fully typed
* Designed for GitHub Actions and CI

---

# Installation

```bash
npm install @yukiakai/actions-git
```

---

# Quick Start

```ts
import {
  prepareGitRepository,
  GITHUB_ACTIONS_IDENTITY,
} from '@yukiakai/actions-git';

const repository = await prepareGitRepository({
  repository: 'owner/repository',
  token: process.env.GITHUB_TOKEN!,
  branch: 'gh-pages',
  workingDirectory: '.deploy',

  identity: GITHUB_ACTIONS_IDENTITY,
});

await repository.wipe(['.']);

await repository.add(['dist']);


if (await repository.hasStagedChanges()) {
  await repository.commit('deploy: update documentation');
  await repository.push();
}
```

---

# API

## `prepareGitRepository(options)`

Prepare a repository for automated Git workflows.

```ts
interface PrepareGitRepositoryOptions {
  repository: string;
  token: string;
  branch: string;
  workingDirectory: string;

  identity: GitIdentity;
}
```

Returns:

```ts
Promise<PreparedGitRepository>
```

The returned repository only exposes workflow operations. Repository initialization APIs are intentionally kept internal.

---

# Built-in Identities

The library provides reusable identities for common CI environments.

## `GITHUB_ACTIONS_IDENTITY`

```ts
import {
  GITHUB_ACTIONS_IDENTITY,
} from '@yukiakai/actions-git';
```

Equivalent to:

```ts
{
  name: 'github-actions[bot]',
  email: 'github-actions[bot]@users.noreply.github.com',
}
```

You can also provide your own identity.

```ts
identity: {
  name: 'Yuki Akai',
  email: 'yuki@example.com',
}
```

---

# PreparedGitRepository

Represents a repository that has already been prepared for write operations.

---

## `wipe(patterns)`

Remove tracked and untracked files.

```ts
await repository.wipe(['.']);
```

Internally executes:

```bash
git rm -r -f --ignore-unmatch
git clean -fdx
```

---

## `add(patterns)`

Stage files.

```ts
await repository.add([
  'dist',
  'package.json',
]);
```

---

## `hasStagedChanges()`

Check whether staged changes exist.

Internally executes:

```bash
git diff --cached --quiet
```

Returns:

* `true` if staged changes exist.
* `false` otherwise.

---

## `commit(message)`

Create a commit.

```ts
await repository.commit(
  'deploy: update documentation',
);
```

---

## `push()`

Push the current checked-out branch.

```ts
await repository.push();
```

The current `HEAD` is pushed to `origin`.

---

# Typical Workflow

```ts
const repository = await prepareGitRepository({
  repository: 'owner/repository',
  token: process.env.GITHUB_TOKEN!,
  branch: 'gh-pages',
  workingDirectory: '.deploy',

  identity: GITHUB_ACTIONS_IDENTITY,
});

await repository.wipe(['.']);

await repository.add(['dist']);

if (!await repository.hasStagedChanges()) {
  return;
}

await repository.commit('deploy');

await repository.push();
```

---

# Designed For

* GitHub Actions
* Documentation deployment
* Static site deployment
* Repository synchronization
* Artifact publishing
* Deployment pipelines
* CI automation

---

# License

MIT © Yuki Akai
