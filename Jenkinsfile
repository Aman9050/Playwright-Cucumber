pipeline {
  agent {
    docker { image 'mcr.microsoft.com/playwright:v1.58.0-focal' args '-u root:root' }
  }
  environment {
    CI = 'true'
  }
  parameters {
    choice(name: 'ENV', choices: ['qa','sit'], description: 'Environment to run tests against')
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
      }
    }
    stage('Run Tests') {
      steps {
        // Runs the appropriate npm test script (e.g. `npm run test:qa` or `npm run test:sit`)
        sh 'npm run test:${ENV}'
      }
    }
  }
  post {
    always {
      // Ensure Allure report generation runs even if tests failed
      sh 'npx allure generate allure-results --clean || true'
      // Archive artifacts so they are available in Jenkins
      archiveArtifacts artifacts: 'allure-report/**, allure-results/**, playwright-report/**', allowEmptyArchive: true
      // If you have the Allure Jenkins plugin, you can publish results with it:
      // allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
    }
    success {
      echo 'Tests finished: artifacts archived.'
    }
    failure {
      echo 'Tests failed: Allure report still generated and archived.'
    }
  }
}