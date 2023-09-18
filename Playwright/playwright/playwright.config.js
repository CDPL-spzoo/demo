import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import user_agents from './user_agents.json'

const ENV = process.env.ENV || process.env.NODE_ENV || 'dev';
dotenv.config({ path: `config/env-config.${ENV}.env` });

export default defineConfig({
    testDir: './tests',
    timeout: 60 * 60 * 1000,
    globalTimeout: 4 * 60 * 60 * 1000,
    expect: { timeout: 15000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 1,
    workers: process.env.CI ? 6 : undefined,
    reporter: [
        ['line']
        , [
            'allure-playwright', {
                detail: false,
                suiteTitle: false,
                stripANSIControlSequences: true,
                attachmentsBaseURL: true
            }
        ]
    ],
    use: {
        navigationTimeout: 30000,
        actionTimeout: 20000,
        ignoreHTTPSErrors: true,
        trace: 'off',
        screenshot: 'on',
        video: 'off',
        launchOptions: {
            proxy: { server: 'http://proxy-uk.narcos.io:1080',
                username: "q35r4e7de988-b383-41a5-afaf-9859e552034a&country=RU",
                password: 'q3rshMJgSRzmCcfrBXL' }
        }

    },
    projects: [
        {
            name: 'chromium-en',
            testIgnore: [/.fr.spec.js/, /mobile-example.*.spec.js/],
            testMatch: [/e2e\//],
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome',
                baseURL: 'https://front-connected-fleet.eks-eu-central-1-private.int.connectedfleet.ridedev.io' +
                    '/connected-fleet/en-US',
                locale: 'en-US',
                userAgent: user_agents[Math.floor(Math.random() * user_agents.length)]
            }
        },
        {
            name: 'chromium-fr',
            testMatch: /e2e\/.*.fr.spec.js/,
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome',
                baseURL: 'https://front-connected-fleet.eks-eu-central-1-private.int.connectedfleet.ridedev.io' +
                    '/connected-fleet/fr-FR',
                geolocation: { latitude: 48.864716, longitude: 2.349014 },
                locale: 'fr-FR'
            }
        },
        {
            name: 'Mobile Chrome',
            testMatch: /e2e\/.*mobile-example.chrome.spec.js/,
            use: {
                ...devices['Pixel 5'],
                baseURL: 'https://front-connected-fleet.eks-eu-central-1-private.int.connectedfleet.ridedev.io' +
                    '/connected-fleet/en-US',
                locale: 'en-US'
            }
        },
        {
            name: 'Mobile Safari',
            testMatch: /e2e\/.*mobile-example.safari.spec.js/,
            use: {
                ...devices['iPhone 12'],
                baseURL: 'https://front-connected-fleet.eks-eu-central-1-private.int.connectedfleet.ridedev.io' +
                    '/connected-fleet/en-US',
                locale: 'en-US'
            }
        },
        {
            name: 'unit',
            testMatch: /unit\/.*.test.js/
        },
        {
            name: 'api',
            testMatch: /api\/.*.spec.js/,
            use: { baseURL: 'https://front-connected-fleet.eks-eu-central-1-private.int.connectedfleet.ridedev.io./connected-fleet' }
        }
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        //
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
    ]

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});

