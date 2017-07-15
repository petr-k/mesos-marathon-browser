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

class MarathonClient {
  url: string

  constructor(url: string) {
    this.url = url
  }

  getApps() {
    const result = fetch(`${this.url}/v2/apps`)
      .then(r => r.json())
    return (result: Promise<AppsResponse>)
  }
}

const client = new MarathonClient('/api/marathon')

export default client

export type AppsResponse = {
  apps: AppDefinition[],
}
