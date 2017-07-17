// @flow

export type Labels = {
  [label: string]: string,
}

export type Env = {
  [key: string]: string,
}

export type Parameter = {
  key: string,
  value: string,
}

export type DockerPortMapping = {
  containerPort: number,
  hostPort: number,
  servicePort: number,
  protocol: string,
  labels: Labels,
}

export type AppcDefinition = {
  image: string,
  labels: Labels,
  forcePullImage: boolean
}

export type DockerDefinition = {
  image: string,
  network: string,
  portMappings: DockerPortMapping[],
  privileged: boolean,
  parameters: Parameter[],
  forcePullImage: boolean,
}

export type Container =
  | { type: 'DOCKER', docker: DockerDefinition }
  | { type: 'MESOS', appc: AppcDefinition }

export type AppDefinition = {
  id: string,
  instances: number,
  cpus: number,
  mem: number,
  labels: Labels,
  env: Env,
  container?: Container,
  version: string,
  tasksStaged: number,
  tasksRunning: number,
  tasksHealthy: number,
  tasksUnhealthy: number,
}

export type DockerImageMetadata = {
  labels: {
    [name: string]: string,
  }
}

export type DockerImageMetadataBatch = {
  [imageName: string]: ?DockerImageMetadata
}

class ApiClient {
  url: string

  constructor(url: string) {
    this.url = url
  }

  getApps(): Promise<AppsResponse> {
    const result = fetch(`${this.url}/marathon/v2/apps`)
      .then(r => r.json())
    return (result: Promise<AppsResponse>)
  }

  getDockerImageMetadata(imageName: string): Promise<DockerImageMetadata> {
    const result = fetch(`${this.url}/docker-registry/metadata/${imageName}`)
      .then(r => r.json())
    return (result: Promise<DockerImageMetadata>)
  }

  getDockerImageMetadataBatch(imageNames: string[]): Promise<DockerImageMetadataBatch> {
    const result = (fetch: any)(`${this.url}/docker-registry/metadata`, {
      method: 'POST',
      body: JSON.stringify(imageNames),
    }).then(r => r.json())
    return (result: Promise<DockerImageMetadataBatch>)
  }
}

const client = new ApiClient('/api')

export default client

export type AppsResponse = {
  apps: AppDefinition[],
}
