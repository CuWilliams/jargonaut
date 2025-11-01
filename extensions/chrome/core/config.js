/**
 * JargoNaut Core Configuration
 * Shared configuration values across all platforms and browsers
 */

const JargoNautConfig = {
    // Version
    version: '1.0.0',
    
    // AI Configuration
    ai: {
        provider: 'OpenRouter',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        referer: 'https://jargonaut.app',
        title: 'JargoNaut'
    },
    
    // Supported Platforms
    platforms: {
        twitter: {
            name: 'Twitter/X',
            domains: ['twitter.com', 'x.com'],
            enabled: true
        },
        linkedin: {
            name: 'LinkedIn',
            domains: ['linkedin.com'],
            enabled: false // Not implemented yet
        },
        instagram: {
            name: 'Instagram',
            domains: ['instagram.com'],
            enabled: false // Not implemented yet
        },
        facebook: {
            name: 'Facebook',
            domains: ['facebook.com'],
            enabled: false // Not implemented yet
        }
    },
    
    // UI Configuration
    ui: {
        buttonPosition: {
            bottom: '30px',
            right: '30px'
        },
        buttonIcon: '🚀',
        colors: {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#22c55e',
            error: '#ef4444'
        }
    },
    
    // Storage Keys
    storage: {
        apiKey: 'apiKey',
        modelSetup: 'modelSetup',
        userPreferences: 'userPreferences'
    }
};

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JargoNautConfig;
}