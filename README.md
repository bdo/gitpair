<h1 align="center">
    <img src=https://github.com/bdo/gitpair/raw/master/docs/logo.png width=90><br>
    gitpair
</h1>

When pair programming or mob programming on git projects, there is a convention that allows us to document our co-authors in the commit message.
However, adding the co-authorship information on every single commit is painful.

Gitpair allows you to setup your team members and commit as normal. It then amends your commit to add your co-authors.

Each author will randomly be credited either as the main author or one of the co-authors, so that we can each be credited in our github contributions view!

### Before gitpair :sob:

![before](https://github.com/bdo/gitpair/raw/master/docs/before-gitpair.png)

### After gitpair :heart_eyes:

![after](https://github.com/bdo/gitpair/raw/master/docs/after-gitpair.png)

gitpair does not require you to change the way you commit. Simplify use the `git commit` command or your favorite tool!

## Setup

### First install gitpair

```
$ npm install -g gitpair
```

### Add authors you'd like to pair with regularly

Add all your co-authors in a .gitpair/authors.json file higher up in directory tree or in your user's home folder:

```json
[
  {
    "name": "Peter Yarrow",
    "email": "peter@ifihadahamm.er",
    "aliases": ["peter"]
  },
  {
    "name": "Paul Stookey",
    "email": "paul@tellitonthemonta.in",
    "aliases": ["paul"]
  },
  {
    "name": "Mary Travers",
    "email": "mary@lemontr.ee",
    "aliases": ["mary"]
  }
]
```

### Install husky

```
$ npm install --save-dev gitpair husky
```

Then configure husky to run `gitpair amend` on every commit, add the following to your `package.json` file:

```json
"husky": {
  "hooks": {
    "post-commit": "gitpair amend"
  }
}
```

Now, you commits will be automatically patched with the co-authoring information!

### Tell gitpair you're pairing

Say you're doing some mob programming with Peter, Paul and Mary:

```bash
gitpair with peter paul mary
```

Then commit your work

```
$ commit -am "Too much of nothing"
```

This will result in the following commit:

```
Author:     Mary Travers <mary@lemontr.ee>

    Too much of nothing

    Co-authored-by: Paul Stookey <paul@tellitonthemonta.in>
    Co-authored-by: Benoit d'Oncieu <bdoncieu@gmail.com>
    Co-authored-by: Peter Yarrow <peter@ifihadahamm.er>
```

Every commit will randomly switch author and co-authors.

## Other commands

### know who you're pairing with

```bash
gitpair info
```

### stop pairing

```bash
gitpair off
```

### resume pairing

```bash
gitpair on
```

### print the co-authored-by trailers

```bash
gitpair trailers
```

### manually amend the last commit

```bash
gitpair amend
```

## You don't want to install gitpair globally

If like me, you don't like to install packages globally, follow these simple instructions.

```bash
npm install --save-dev gitpair
```

Then add the following alias to your profile script (e.g. ~/.bashrc or ~/.zshrc):

```bash
alias gitpair='$(npm bin)/gitpair'
```

And then you can run gitpair by just using `gitpair`.
