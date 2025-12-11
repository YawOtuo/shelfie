export const tokenManager = {
	getToken: () => {
		return null;
	},
	setToken: (_token: string) => {
		// no-op in cookie-based model
	},
	removeToken: () => {
		// no-op in cookie-based model
	},
	// Unified JWT decoder: works for backend access tokens and Cognito idTokens
	decodeToken: (token: string) => {
		const parts = token.split('.');
		if (parts.length !== 3 || !parts[1]) throw new Error('Invalid token format');
		let payloadRaw = '';
		if (typeof atob === 'function') {
			payloadRaw = atob(parts[1]);
		} else {
			const nodeBuffer = (globalThis as any).Buffer;
			if (nodeBuffer && typeof nodeBuffer.from === 'function') {
				payloadRaw = nodeBuffer.from(parts[1], 'base64').toString('utf-8');
			} else {
				throw new Error('Base64 decoder not available');
			}
		}
		return JSON.parse(payloadRaw || '{}');
	}
}; 