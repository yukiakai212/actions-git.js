type AbsoluteDirectoryPath = string;

interface GitInspectionResult {
    exitCode: number;
}
interface GitIdentity {
    readonly name: string;
    readonly email: string;
}
declare enum GitInspectionOperation {
    StagedChangesPresence = "stagedChangesPresence",
    LocalBranchPresence = "localBranchPresence",
    RemoteBranchPresence = "remoteBranchPresence"
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

interface UnexpectedGitInspectionResultErrorOptions {
    readonly result: GitInspectionResult;
    readonly operation: GitInspectionOperation;
}
type UnexpectedGitInspectionResultErrorDetails = UnexpectedGitInspectionResultErrorOptions;
declare class UnexpectedGitInspectionResultError extends Error {
    private options;
    readonly details: UnexpectedGitInspectionResultErrorDetails;
    constructor(options: UnexpectedGitInspectionResultErrorOptions);
}

export { type AbsoluteDirectoryPath, GITHUB_ACTIONS_IDENTITY, type GitIdentity, GitInspectionOperation, type GitInspectionResult, GitRepository, type PrepareGitRepositoryOptions, type PreparedGitRepository, UnexpectedGitInspectionResultError, type UnexpectedGitInspectionResultErrorDetails, type UnexpectedGitInspectionResultErrorOptions, prepareGitRepository };
