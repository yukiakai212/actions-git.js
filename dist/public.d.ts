import { ExecOptions } from '@actions/exec';

interface GitExecResult {
    exitCode: number;
}
interface GitOptions {
    cwd: string;
    repo: string;
    branch: string;
    token: string;
}

declare class GitClient {
    private options;
    constructor(options: GitOptions);
    private get repoUrl();
    protected execGitRaw(args: string[], options?: ExecOptions): Promise<GitExecResult>;
    private execGit;
    private execGitInspectable;
    clone(): Promise<void>;
    wipe(pattern: string[]): Promise<void>;
    setup(): Promise<void>;
    checkout(): Promise<void>;
    pullRebase(): Promise<void>;
    commit(message: string): Promise<void>;
    add(pattern: string[]): Promise<void>;
    push(): Promise<void>;
    hasChanges(): Promise<boolean>;
    private branchExists;
}

export { GitClient, type GitOptions };
