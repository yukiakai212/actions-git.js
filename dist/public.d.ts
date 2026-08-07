type AbsoluteDirectoryPath = string;

interface GitIdentity {
    readonly name: string;
    readonly email: string;
}

interface GitRepositoryOptions {
    workingDirectory: AbsoluteDirectoryPath;
}
declare class GitRepository {
    private options;
    constructor(options: GitRepositoryOptions);
    private execute;
    private executeInspectable;
    wipe(pattern: string[]): Promise<void>;
    setupIdentity(identity: GitIdentity): Promise<void>;
    checkout(branch: string): Promise<void>;
    checkoutOrphan(branch: string): Promise<void>;
    pull(): Promise<void>;
    pullRebase(branch: string): Promise<void>;
    commit(message: string): Promise<void>;
    add(pattern: string[]): Promise<void>;
    push(): Promise<void>;
    hasStagedChanges(): Promise<boolean>;
    hasLocalBranch(branch: string): Promise<boolean>;
}

type PreparedGitRepository = Omit<GitRepository, 'setupIdentity' | 'checkout' | 'checkoutOrphan' | 'pullRebase' | 'hasLocalBranch'>;

interface PrepareGitRepositoryOptions {
    readonly repository: string;
    readonly token: string;
    readonly branch: string;
    readonly directory: AbsoluteDirectoryPath;
    identity: GitIdentity;
}
declare function prepareGitRepository(options: PrepareGitRepositoryOptions): Promise<PreparedGitRepository>;

declare const GITHUB_ACTIONS_IDENTITY: GitIdentity;

export { type AbsoluteDirectoryPath, GITHUB_ACTIONS_IDENTITY, type GitIdentity, GitRepository, type PrepareGitRepositoryOptions, type PreparedGitRepository, prepareGitRepository };
