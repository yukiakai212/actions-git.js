# @yukiakai/actions-git

> Lightweight Git client for GitHub Actions and CI workflows.

`@yukiakai/actions-git` prepares a Git repository for automated workflows.

The library handles repository setup for you—including cloning, branch initialization, and Git identity configuration—then returns a repository that is ready to commit and push.

> It is designed for GitHub Actions and other CI environments, but it does not hard-code a Git hosting provider.

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
* Absolute, relative, and glob pathspec inputs for staging and cleanup
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
  GITHUB_ACTIONS_IDENTITY,
  prepareGitRepository,
} from '@yukiakai/actions-git';

const repository = await prepareGitRepository({
  remote: {
    url: 'https://github.com/owner/repository.git',
    authentication: {
      username: 'x-access-token',
      password: process.env.GITHUB_TOKEN!,
    },
  },
  branch: 'gh-pages',
  destinationDirectory: path.resolve('.deploy'),
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
  readonly remote: {
    readonly url: string;
    readonly authentication: {
      readonly username: string;
      readonly password: string;
    };
  };
  readonly branch: string;
  readonly destinationDirectory: string;
  readonly identity: {
    readonly name: string;
    readonly email: string;
  };
}
```

| Option | Description |
| --- | --- |
| `remote.url` | Complete HTTP or HTTPS Git repository URL, without embedded credentials. |
| `remote.authentication` | HTTP Basic credentials used to access the remote. A token can be supplied as `password`. |
| `branch` | Branch to prepare for the workflow. |
| `destinationDirectory` | Absolute local directory where the repository is cloned. |
| `identity` | Git `user.name` and `user.email` written to the prepared repository. |

If `branch` exists on the remote, the package shallow-clones that branch. Otherwise, it clones the remote's default branch, creates an orphan branch with the requested name, and removes the inherited files.

The function returns `Promise<PreparedGitRepository>`. Initialization operations stay internal; the returned repository is ready for workflow operations such as `wipe`, `add`, `commit`, and `push`.

## Authentication and security

`prepareGitRepository` supports HTTP(S) remotes with HTTP Basic authentication. The input URL must be a complete URL without a username or password; authentication is supplied separately so it can be encoded safely.

For GitHub, a common configuration is `x-access-token` as the username and a `GITHUB_TOKEN` or personal access token as the password. Other Git hosts can use their own HTTP Basic username and password/token convention.

The prepared repository uses the authenticated remote URL so that later `pull()` and `push()` operations can authenticate. Treat its `.git/config` as sensitive:

- Do not print `git remote -v` or Git configuration in CI logs.
- Do not upload the checkout or its `.git` directory as an artifact.
- Keep the checkout in an ephemeral or cleaned-up workspace when possible.

## Pathspec inputs

`wipe()` and `add()` accept repository pathspec inputs. These may be:

- Absolute file or directory paths inside the prepared repository.
- Paths relative to the prepared repository root.
- Absolute or relative glob patterns, such as `dist/**` or `packages/*/coverage/**`.

Inputs are normalized to Git-compatible repository-relative pathspecs. A pathspec that resolves outside the repository is rejected.

## `PreparedGitRepository`

### `wipe(pathspecInputs)`

Removes tracked and untracked files matching the supplied pathspecs.

```ts
await repository.wipe(['.']);
```

Internally, it runs the equivalent of:

```bash
git rm -r -f --ignore-unmatch -- <pathspecs>
git clean -fdx -- <pathspecs>
```

### `add(pathspecInputs)`

Stages files matching the supplied pathspecs.

```ts
await repository.add([
  'dist',
  'package.json',
]);
```

Internally, it runs:

```bash
git add -- <pathspecs>
```

### `hasStagedChanges()`

Returns `true` when the index contains staged changes.

```ts
if (await repository.hasStagedChanges()) {
  // Commit and push.
}
```

### `commit(message)`

Creates a commit with the configured identity.

```ts
await repository.commit('deploy: update documentation');
```

### `push()`

Push the current checked-out branch.

```ts
await repository.push();
```

The current `HEAD` is pushed to `origin`.
	
---

# Built-in Identities

`GITHUB_ACTIONS_IDENTITY` configures the standard GitHub Actions bot identity.

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
