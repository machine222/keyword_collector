export type GoogleWorkspaceConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

export function describeWorkspaceIntegration(config: GoogleWorkspaceConfig) {
  return {
    projectId: config.projectId,
    description:
      'Google Cloud Storage와 Workspace Drive를 활용해 백업 레이어를 구축하고, AppSheet나 Calendar와 연동할 수 있습니다.'
  };
}
