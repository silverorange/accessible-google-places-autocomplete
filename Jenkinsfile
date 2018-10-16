pipeline {
    agent any

    environment {
        SLACK_CHANNEL = '#ci'
    }

    stages {
        stage('install dependencies') {
            steps {
                sh 'yarn install --mutex network'
            }
        }

        stage('lint') {
            steps {
                sh 'yarn lint'
            }
            post {
                failure {
                    script {
                        if (env.BRANCH_NAME == 'master') {
                            slackSend(
                                channel: env.SLACK_CHANNEL,
                                message: "${env.JOB_NAME.split('/')[1]} (${env.BRANCH_NAME}) ${env.STAGE_NAME.toLowerCase()} failed. (<${env.RUN_DISPLAY_URL}|View in Jenkins>)",
                                color: 'warning'
                            )
                        }
                    }
                }
            }
        }

        stage('test') {
            environment {
                CI = 'true'
                NODE_ENV = 'test'
            }
            steps {
                sh 'yarn test:ci'
                junit 'junit.xml'
            }
            post {
                failure {
                    script {
                        if (env.BRANCH_NAME == 'master') {
                            slackSend(
                                channel: env.SLACK_CHANNEL,
                                message: "${env.JOB_NAME.split('/')[1]} (${env.BRANCH_NAME}) ${env.STAGE_NAME.toLowerCase()} failed. (<${env.RUN_DISPLAY_URL}|View in Jenkins>)",
                                color: 'danger'
                            )
                        }
                    }
                }
            }
        }

        stage('build') {
            steps {
                sh 'yarn build'

                // Make sure the build output is unchanged from the current
                // commit.
                sh '[ "$(git status -s dist/ | wc -l)" -eq "0" ]'
            }
            post {
                failure {
                    script {
                        if (env.BRANCH_NAME == 'master') {
                            slackSend(
                                channel: env.SLACK_CHANNEL,
                                message: "${env.JOB_NAME.split('/')[1]} (${env.BRANCH_NAME}) ${env.STAGE_NAME.toLowerCase()} failed. (<${env.RUN_DISPLAY_URL}|View in Jenkins>)",
                                color: 'warning'
                            )
                        }
                    }
                }
            }
        }
    }
}
