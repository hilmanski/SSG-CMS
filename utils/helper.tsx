import {GithubRepository} from '../types'
import { CMSConfig } from '../cms.config'


export function getRepositories(): GithubRepository[] {
    return CMSConfig.repositories
}

export function findRepo(repoName: string) {
    const repositories = CMSConfig.repositories
    return repositories.find((repo: GithubRepository) => repo.name === repoName)
}

export function findContent(repoName: string, contentName: string) {
    const repository = findRepo(repoName)
    return repository?.contents.find((content: any) => content.name === contentName)
}

export function getUsername(): string {
    return CMSConfig.username
}