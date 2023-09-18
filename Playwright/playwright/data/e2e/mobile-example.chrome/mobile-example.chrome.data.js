module.exports = {
    nav: {
        'en-US': {
            vehicles: '/vehicles?page=1',
            trips: '/trips?page=1',
            drivers: '/drivers?page=1&active=0',
            'dynamic-map': '/dynamic-map',
            export: '/report?type=trips',
            import: '/import?type=fleet-drivers',
            notifications: '/notifications',
            settings: '/settings',
            'admin-fleets': '/admin-fleets?page=1&active=0',
            'admin-eligibilities': '/admin-eligibilities',
            'dashboard': '/dashboard'
        },
        'fr-FR': {
            vehicles: '/vehicules?page=1',
            trips: '/trajets?page=1',
            drivers: '/conducteurs?page=1&active=0',
            'dynamic-map': '/carte-dynamique',
            export: '/rapport?type=trips',
            import: '/import?type=fleet-drivers',
            notifications: '/notifications',
            settings: '/parametres',
            'admin-fleets': '/admin-flottes?page=1&active=0',
            'admin-eligibilities': '/admin-eligibilites',
            'dashboard': '/tableau-de-bord'
        }
    },
    noResultsMessage: {
        'en-US': 'No results\nTry another VIN / License plate number, or delete filters',
        'fr-FR': 'Pas de résultats\nEssayez avec un autre VIN / plaque d\'immatriculation ou supprimer des filtres'
    }
};
