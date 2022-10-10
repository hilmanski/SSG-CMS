# STATUS
Under heavy development. Nothing to see yet.

## To think:
How do you differentiate between projects.
what's the normal case? people have different projects or only one?
    do based on majority...

If(multiple) -> then dashboard show/choose between repo 
    based on file name like NextJS flow repo/[repoName]
 
## Rules
name only string , numebr, underscore and - (no whitespace)

# About SSG Admin
"SSG Admin" is a simple CMS for static site generator.  
It enables developer to easily manage their SSG-contents on Github.  
Don't overclaim.
State that this is works for Hugo. (slowly see how other collection handle Hugo)

## Benefit
- (+) Super simple 
- (+) Free to deploy on Vercel (Self Host)
- (+) Easy to use using Schema-based like other popular headless-CMS
- (+) Can be used for multiple projects under one dashboard
- (+) It's SSG-agnostic
- (+) Easy to customize
- (+) Using uploadcare to easily upload contents

## Todo v0.1
- Create basic MVP
- Create super clear docs: what's the goal, for whom and how to start
- Create specific instruction based on SSG used.
- Get list of file name in /projects to put on dashboard

## Technical Plan 
- User define schema information of their content.
- This schema consumed by Frontend to generate dynamic form.
- This schema consumed by Backend to generate markdown files.
- Using Octokit (Github API) to manage content on specific folder.
- No signup/login. "Auth" replaced with secret_code that stored in localstorage which refers to what in vercel .env 

## On v0.2
- How to make the token only works for certain repo (repo that user gave authorization too). Not general token. Useful?
- If have enough feedback / many people use it > try to implement as installable package

## Tech
- [NextJS](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs)
- [Octokit library](https://docs.github.com/en/rest/overview/libraries)
- [Hosted on Vercel](https://vercel.com/)

## Other info 
Inspiration from [Github Content CRUD API](https://github.com/hilmanski/Github-content-CRUD-API)  
Question/Feedback -> [Hil](https://twitter.com/hilmanski)