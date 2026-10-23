
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'shagunbhati16/cca2-task-manager'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Source code checked out successfully.'
            }
        }

        stage('Build and Test') {
            steps {
                echo 'Running application tests...'
                sh '''
                    docker run --rm \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        node:22-alpine npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image version ${BUILD_NUMBER}..."
                sh '''
                    docker build \
                        -t "$IMAGE_NAME:$BUILD_NUMBER" \
                        -t "$IMAGE_NAME:latest" .
                '''
            }
        }

        stage('Verify Docker Image') {
            steps {
                sh '''
                    docker image inspect "$IMAGE_NAME:$BUILD_NUMBER"
                    docker image inspect "$IMAGE_NAME:latest"
                '''
                echo 'Docker images built and verified successfully.'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        echo "$DOCKERHUB_TOKEN" | docker login \
                            --username "$DOCKERHUB_USERNAME" \
                            --password-stdin

                        docker push "$IMAGE_NAME:$BUILD_NUMBER"
                        docker push "$IMAGE_NAME:latest"

                        docker logout
                    '''
                }
                echo 'Docker images published successfully.'
            }
        }

        stage('Verify Kubernetes Access') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'kubeconfig-file',
                        variable: 'KUBECONFIG_FILE'
                    )
                ]) {
                    sh '''
                        set +x

                        kubectl --kubeconfig="$KUBECONFIG_FILE" \
                            get deployments -n default

                        kubectl --kubeconfig="$KUBECONFIG_FILE" \
                            get pods -n default
                    '''
                }
                echo 'Kubernetes access verified successfully.'
            }
        }

        stage('Deploy to Minikube') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'kubeconfig-file',
                        variable: 'KUBECONFIG_FILE'
                    )
                ]) {
                    sh '''
                        set +x

                        echo "Deploying image version $BUILD_NUMBER..."

                        kubectl --kubeconfig="$KUBECONFIG_FILE" \
                            set image deployment/taskflow \
                            taskflow="$IMAGE_NAME:$BUILD_NUMBER" \
                            -n default

                        kubectl --kubeconfig="$KUBECONFIG_FILE" \
                            rollout status deployment/taskflow \
                            -n default --timeout=180s

                        kubectl --kubeconfig="$KUBECONFIG_FILE" \
                            get deployments -n default
                    '''
                }
                echo 'TaskFlow deployed successfully to Minikube.'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
            echo 'The Docker image was tested, published, and deployed to Kubernetes.'
        }

        failure {
            echo 'Pipeline failed. Check Console Output for the failing stage.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
