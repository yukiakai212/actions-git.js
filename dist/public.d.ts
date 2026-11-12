type AbsoluteDirectoryPath = string;
type AbsoluteFilePath = string;
type RelativeFilePath = string;
type RelativeDirectoryPath = string;
type AbsoluteGlobPattern = string;
type RelativeGlobPattern = string;

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
type GitRepositoryPathspecInput = AbsoluteDirectoryPath | AbsoluteFilePath | RelativeFilePath | RelativeDirectoryPath | AbsoluteGlobPattern | RelativeGlobPattern;
type GitRepositoryPathspec = string;
interface GitHttpBasicAuthentication {
    readonly username: string;
    readonly password: string;
}
interface GitRemoteOptions {
    readonly url: string;
    readonly authentication: GitHttpBasicAuthentication;
}

interface GitRepositoryCommandExecutorOptions {
    readonly workingDirectory: AbsoluteDirectoryPath;
}
declare class GitRepositoryCommandExecutor {
    private readonly options;
    constructor(options: GitRepositoryCommandExecutorOptions);
    execute(args: readonly string[]): Promise<void>;
    inspect(args: readonly string[]): Promise<GitInspectionResult>;
}

interface GitRepositoryPathspecResolverOptions {
    readonly repositoryDirectory: AbsoluteDirectoryPath;
}
declare class GitRepositoryPathspecResolver {
    private options;
    constructor(options: GitRepositoryPathspecResolverOptions);
    resolve(pathspec: GitRepositoryPathspecInput): GitRepositoryPathspec;
    resolveAll(pathspecs: GitRepositoryPathspecInput[]): GitRepositoryPathspec[];
    private isOutsideRepository;
}

declare class GitRepository {
    private readonly commandExecutor;
    private readonly pathspecResolver;
    constructor(commandExecutor: GitRepositoryCommandExecutor, pathspecResolver: GitRepositoryPathspecResolver);
    wipe(pathspecInputs: GitRepositoryPathspecInput[]): Promise<void>;
    setupIdentity(identity: GitIdentity): Promise<void>;
    checkout(branch: string): Promise<void>;
    checkoutOrphan(branch: string): Promise<void>;
    pull(): Promise<void>;
    pullRebase(branch: string): Promise<void>;
    commit(message: string): Promise<void>;
    add(pathspecInputs: GitRepositoryPathspecInput[]): Promise<void>;
    push(): Promise<void>;
    hasStagedChanges(): Promise<boolean>;
    hasLocalBranch(branch: string): Promise<boolean>;
}

type PreparedGitRepository = Omit<GitRepository, 'setupIdentity' | 'checkout' | 'checkoutOrphan' | 'pullRebase' | 'hasLocalBranch' | 'pull'>;

interface PrepareGitRepositoryOptions {
    readonly remote: GitRemoteOptions;
    readonly branch: string;
    readonly destinationDirectory: AbsoluteDirectoryPath;
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

export { type AbsoluteDirectoryPath, type AbsoluteFilePath, type AbsoluteGlobPattern, GITHUB_ACTIONS_IDENTITY, type GitHttpBasicAuthentication, type GitIdentity, GitInspectionOperation, type GitInspectionResult, type GitRemoteOptions, GitRepository, type GitRepositoryPathspecInput, type PrepareGitRepositoryOptions, type PreparedGitRepository, type RelativeDirectoryPath, type RelativeFilePath, type RelativeGlobPattern, UnexpectedGitInspectionResultError, type UnexpectedGitInspectionResultErrorDetails, type UnexpectedGitInspectionResultErrorOptions, prepareGitRepository };
