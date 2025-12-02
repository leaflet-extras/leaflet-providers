# So you want to add a layer?

Yay! go add it to the leaflet-providers.js as long as it follows the following
rules:

- Don't violate a providers TOS (if it exists, include a link to it)
- Don't pre-populate api keys with working keys.
- It should be a basic tile source, no external libraries etc.
- The owner hasn't asked us to remove it (hasn't happened yet)

## Contribution rules

The [CHANGELOG.md](CHANGELOG.md) is generated with `standard-changelog` (using the command `npm run release`).

To make this possible the commit messages / pull request titles must follow the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>: <subject>

[optional body]

[optional footer(s)]
```

The following is the list of supported types:

- build: changes that affect build components like build tool, ci pipeline, dependencies, project version, etc...
- chore: changes that aren't user-facing (e.g. merging branches).
- ci: changes to the CI configuration files and scripts (basically directory .github/workflows).
- docs: changes that affect the documentation only.
- feat: changes that introduce a new feature.
- fix: changes that patch a bug.
- perf: changes which improve performance.
- refactor: changes which neither fix a bug nor add a feature.
- revert: changes that revert a previous commit.
- style: changes that don't affect code logic, such as white-spaces, formatting, missing semi-colons.
- test: changes that add missing tests or correct existing tests.

For breaking changes a footer with the following content must be used.
BREAKING CHANGE: <description of what is broken by this commit>

## Developer commands

- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.
