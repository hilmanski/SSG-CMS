# STATUS
Under heavy development. Nothing to see yet.

# About SSG Admin
"SSG Admin" is a simple CMS for static site generator.  
It enables developer to easily manage their SSG-contents on Github.  

## Benefit
(+) Super simple 
(+) Free to deploy on Vercel
(+) Easy to use using Schema-based like other popular headless-CMS
(+) Can be used for multiple projects under one dashboard
(+) It's SSG-agnostic
(+) Using uploadcare to easily upload contents

## Todo
- Create basic MVP
- Create super clear docs: what's the goal, for whom and how to start
- Create specific instruction based on SSG used.

## Technical Plan 
- User define schema information of their content.
- This schema consumed by Frontend to generate dynamic form.
- This schema consumed by Backend to generate markdown files.
- Using Octokit (Github API) to manage content on specific folder.
- No signup/login. "Auth" replaced with secret_code that stored in localstorage which refers to what in vercel .env 

## Tech
- [NextJS](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs)
- [Octokit library](https://docs.github.com/en/rest/overview/libraries)
- [Hosted on Vercel](https://vercel.com/)

## Other info 
Inspiration from [Github Content CRUD API](https://github.com/hilmanski/Github-content-CRUD-API)