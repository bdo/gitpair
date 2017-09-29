<h1 align="center">
    <img src=https://github.com/bdo/gitpair/raw/master/docs/logo.png width=90><br>
    gitpair
</h1>

When pairing or doing mob programming on github projects, git does not allow us to commit with all the names of people who contributed. 
gitpair allows you to setup your team members and commit as normal. It then changes your commit based on the list of people referenced in the commit message.

Each author will randomly be credited with commiter or authorship, so that we can each be credited in our github contributions view !

### Before gitpair :sob:
![before](https://github.com/bdo/gitpair/raw/master/docs/before-gitpair.png)

### After gitpair :heart_eyes:
![after](https://github.com/bdo/gitpair/raw/master/docs/after-gitpair.png)

gitpair does not require you to change the way you commit. Simplify use the `git commit` command or your favorite tool! 

### Example:
The following two commits
```
$ commit -am "JBH|BDO|JON Added README file"
```
```
$ commit -am "@jordan @benoit @jonathan Added README file"
```
are equivalent and will result in the following commit:
```
commit 5aac6c15b7ea2b8ed6b8daaba01539931b9d9309
Author:     Jordan Bartholomew-Harrison, Benoit d'Oncieu and Jon McClennon <bdoncieu@gmail.com>
AuthorDate: Thu Oct 27 22:09:34 2016 +0200
Commit:     Jon McClennon <Jon.McClennon@gmail.com>
CommitDate: Thu Oct 27 22:09:34 2016 +0200

    BDO|JM: Added README file
```

The _author's_ name contains the list of all author names while the _author_ and _committer_ emails will be *randomly* choosen amongst the list of committers. The commit message is normalised as a pipe separated list of  initials followed by a dash. 

## Installation

### Pre-requisites

A recent version of `node` and `npm`.

### Install

```
$ npm install --save gitpair
```

#### With [husky](https://github.com/typicode/husky)

Update your package.json to run the hook script:

```json
{
  ...
  "scripts": {
    "postcommit": "$(npm bin)/gitpair hook"
  }
}
```

#### Manually adding the hook

```bash
$(npm bin)/gitpair install
```

The installation adds a `post-commit` hook at the root of your project in the `.git/hooks` directory.


### Configure

Create a `.gitpair` file in your project or home folder:

```json
{
  "team": [
    { "name": "Benoit d'Oncieu",             
      "aliases": ["bdo", "benoit"],
      "email": "bdoncieu@gmail.com" },
    { "name": "Jon McClennon",
      "aliases": ["jm", "jon", "jonathan", "jonathanmcclennon"],   
      "email": "Jon.McClennon@gmail.com" },
    { "name": "Jordan Bartholomew-Harrison", 
      "aliases": ["jbh", "jordan", "jordanbharrison"], 
      "email": "jordan.bh@outlook.com" }
  ]
}
```

In a project, you can get this file started by running:

```bash
$(npm bin)/gitpair init
```

## Commit message patterns

You can use one of two styles of commit messages. The user names used must correspond to one of the aliases you listed in your `.gitpair` file (see above).

| Github styled | Initials |
| --- | --- |
| @bdo @jon Added package.json | BDO\|JON: Added package.json |

Notes:
- The normalised format message will use the `Initials` pattern and the first `alias` for each author.
- When using the `Initials` flavor, the semicolon is optional.
- When using the github styled initials, you can also specify users not in your team by tagging their github username. The git hook will ask if you want to add their info to your team.

## Should I commit my .gitpair file into my repo?

There are a few questions you need to ask yourself to answer this:

 - Is my repository private?
 - Should I be exposing email addresses in my repository (a more important question for public repositories)?
 - Will everyone working on this repository be pairing with the same people?

If you answered no to any of these questions, then you likely want to have .gitpair in your local .gitignore.


## Uninstall

### Remove git hook

```bash
$(npm bin)/gitpair install -u
```

### Removing the package

```
$ npm uninstall gitpair
```

This automatically removes the `post-commit` hook if it exists.
