
# TaskFlow — CI/CD Pipeline Implementation

## 1. Project Overview

TaskFlow is a browser-based task management application developed for the CCA2 Cloud Computing and DevOps assignment. Users can create, edit, complete, search, filter, and delete tasks.

The project demonstrates a CI/CD workflow using GitHub, Jenkins, Docker, Docker Hub, Kubernetes, and Minikube.

Task information is stored in browser local storage in this version of the application.

## 2. Project Links

- GitHub: https://github.com/ShagunBhati16/cca2-task-manager
- Docker Hub: https://hub.docker.com/r/shagunbhati16/cca2-task-manager

## 3. Repository Structure

```text
cca2-task-manager/
├── server.js
├── package.json
├── Dockerfile
├── Jenkinsfile
├── README.md
└── k8s/
    ├── deployment.yaml
    └── service.yaml
```

## 4. Technologies Used

- GitHub — source code management and version history.
- Jenkins — executes the CI/CD pipeline.
- Docker — builds the application container image.
- Docker Hub — stores published Docker images.
- Kubernetes — manages application deployment and replicas.
- Minikube — provides a local Kubernetes cluster.
- kubectl — checks and manages Kubernetes resources.

## 5. Jenkins Setup and Configuration

The Jenkins pipeline job is named `cca2-task-manager-pipeline`.

The job is configured to use:
- Git repository: `https://github.com/ShagunBhati16/cca2-task-manager`
- Branch: `main`
- Pipeline script path: `Jenkinsfile`
- Definition: Pipeline script from SCM

Docker Hub authentication and Kubernetes access are configured through Jenkins Credentials. Secret values are not stored in the repository.

### Hosting environment

The development setup used Jenkins at `http://localhost:8080`, running in Docker on the local machine, with Minikube running locally.

The assignment also specifies Jenkins on AWS. This local setup does not establish that requirement. If Jenkins was separately installed on AWS EC2, document the actual instance, installation, network access, plugins, credentials, and job configuration here. Do not claim AWS hosting unless it was completed.

## 6. CI/CD Pipeline Stages

1. **Checkout SCM:** Retrieves the committed source code from GitHub.
2. **Build and Test:** Runs the configured check. In this project, `npm test` executes `node --check server.js`, which checks JavaScript syntax rather than performing full functional tests.
3. **Build Docker Image:** Builds the application image from the Dockerfile and tags it with the Jenkins build number and `latest`.
4. **Verify Docker Image:** Checks that the image was created.
5. **Push to Docker Hub:** Publishes the image tags to `shagunbhati16/cca2-task-manager`.
6. **Verify Kubernetes Access:** Checks that Jenkins can access the configured Kubernetes cluster.
7. **Deploy to Minikube:** Updates the `taskflow` Deployment to use the current build-number image and waits for rollout completion.

The pipeline was verified through Jenkins Console Output. Include evidence of the successful run in the submission.

## 7. Docker Image Build and Publishing

The Dockerfile uses `node:22-alpine` as its base image, copies the application files, sets port 3000, and starts the server with `node server.js`.

Jenkins builds the image, assigns a build-number tag and a `latest` tag, and pushes them to Docker Hub using stored credentials.

Image tags:
https://hub.docker.com/r/shagunbhati16/cca2-task-manager/tags

## 8. Kubernetes Deployment

The `k8s/deployment.yaml` file defines the `taskflow` Deployment with two replicas.

The `k8s/service.yaml` file defines the `taskflow` Service, which routes traffic to application port 3000.

Useful verification commands:

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl rollout status deployment/taskflow
kubectl get deployment taskflow -o jsonpath="{.spec.template.spec.containers[0].image}"
```

To access the application through Minikube:

```bash
minikube service taskflow
```

Verify that the Service ports and resource configuration match the running cluster.

## 9. Source-Code Change and Second Pipeline Run

For the CI/CD demonstration, the visible heading in `server.js` was changed from:

`Make today count.`

to:

`Make today count. — CI/CD Updated`

The change was committed to GitHub. The Jenkins pipeline was run again to rebuild and publish the image and deploy it to Kubernetes.

For the final demonstration, the heading was restored to `Make today count.` and the pipeline was run again. After deployment, the browser was refreshed to verify the final heading.

The pipeline was triggered using Jenkins **Build Now**. This is a manual trigger; it does not mean that every GitHub commit automatically starts a build.

## 10. Verification Evidence

Add screenshots showing:

1. GitHub repository and required files.
2. Jenkins pipeline stages and successful Console Output.
3. Docker Hub image tags.
4. Kubernetes Deployment, pods, and Service.
5. TaskFlow running in the browser after the source-code change.

## 11. Conclusion

TaskFlow demonstrates a container-based application delivery workflow using source control, pipeline automation, Docker image publishing, and Kubernetes deployment.

The pipeline helps make application updates repeatable and provides verification steps for image creation, registry publishing, and deployment.
