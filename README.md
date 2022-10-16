## Now
- Work on get (edit page)
    Document it. For issue. if you/anyone can improve it. By removing this unncessary quote
        from beginning. So no need to edit it.

- Work on update page
- Add protected secret_code

## Todo v0.1
- Create basic MVP (focus for Hugo only)
- Create super clear docs: what's the goal, for whom and how to start
- Create specific instruction based on SSG used.
- Get list of file name in /projects to put on dashboard
- Delete everything not custom to your usage
- Fork for your usage, Add CORS for Vercel
- It should work for [TOML] or [YAML]

# STATUS
Under heavy development. Nothing to see yet.

## To think:
How do you differentiate between projects.
what's the normal case? people have different projects or only one?
    do based on majority...

If (multiple) -> then dashboard show/choose between repo 
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


## Technical Plan 
- User define schema information of their content.
- This schema consumed by Frontend to generate dynamic form.
- This schema consumed by Backend to generate markdown files.
- Using Octokit (Github API) to manage content on specific folder.
- No signup/login. "Auth" replaced with secret_code that stored in localstorage which refers to what in vercel .env 

## Raw Ideas v0.2
- How to make the token only works for certain repo (repo that user gave authorization too). Not general token. Useful?
- If have enough feedback / many people use it > try to implement as installable package
- Can schema generated from GUI ?
    you can! by play with fs

## Tech
- [NextJS](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs)
- [Octokit library](https://docs.github.com/en/rest/overview/libraries)
- [Hosted on Vercel](https://vercel.com/)
- [ToastUI Editor](https://ui.toast.com/tui-editor/)

## Other info 
Inspiration from [Github Content CRUD API](https://github.com/hilmanski/Github-content-CRUD-API)  
Question/Feedback -> [Hil](https://twitter.com/hilmanski)