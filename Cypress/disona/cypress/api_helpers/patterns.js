import { faker } from '@faker-js/faker'

export const profilePattern = () => {
	return {
		first_name: `${faker.name.firstName()}`,
		patronymic_name: '',
		last_name: `${faker.name.lastName()}`,
		nick_name: '',
		is_male: true,
		is_swap_free: false,
		meta_data: {
			address: `${faker.address.streetAddress()}`,
			countryOfResidence: 'TON',
			dateOfBirth: '25.04.2001',
			desktopNotifications: false,
			emailAboutSuspiciousSignInAttempts: false,
			emailWhenNewIdeaIsPublished: false,
			estimatedAnnualIncome: '$20,000 - $50,000',
			estimatedNetWorth: '$20,000 - $50,000',
			nationality: 'IND',
			natureOfBusinessOrProfessionOrIndustry: 'Engineering',
			notificationSound: false,
			notifications: {
				emailNotifications: {
					notifyByEmailAboutAutomatedDeals: false,
					notifyByEmailAboutAutomatedPositionEdits: false,
					notifyByEmailAboutManualDeals: false,
					notifyByEmailAboutManualPositionEdits: false,
					notifyByEmailAboutBusinessUpdates: false,
					notifyByEmailAboutTradingIdeas: false,
					notifyByEmailAboutNewProductsAndServices: false,
					notifyByEmailAboutNewsAndOffers: false,
					alerts: {
						turnOnPriceAlertsByEmail: false,
						turnOnIndicatorAlertsByEmail: false,
						turnOnEconomicAlertsByEmail: false,
					},
				},
				onSiteNotifications: {
					notifyOnSiteAboutAutomatedDeals: false,
					notifyOnSiteAboutAutomatedPositionEdits: false,
					notifyOnSiteAboutManualDeals: false,
					notifyOnSiteAboutManualPositionEdits: false,
					notifyOnSiteAboutBusinessUpdates: false,
					notifyOnSiteAboutTradingIdeas: false,
					notifyOnSiteAboutNewProductsAndServices: false,
					notifyOnSiteAboutNewsAndOffers: false,
					alerts: {
						turnOnPriceAlertsOnSite: false,
						turnOnIndicatorAlertsOnSite: false,
						turnOnEconomicAlertsOnSite: false,
					},
				},
			},
			originOfIncomeAndWealth: 'Borrowing/ Loan',
			reasonForOpeningTheAccount: 'Speculation',
			relevantKnowledgeToUnderstandTheRisksInvolved: 'Yes',
			sourceOfFunds: 'Inheritance',
			statusOfEmployment: 'Retired',
			tradingExperience: 'Yes, less than 1 year’s trading experience',
			twoFactorAuth: {
				twoFactorAuthByEmail: false,
				twoFactorAuthBySms: false,
			},
		},
		date_info: null,
		region: 'TON',
	}
}
