export const NETWORK_SUPPRESS_MS = 5000

let suppressErrorsUntil = 0
export const startNetworkSuppression = (ms = NETWORK_SUPPRESS_MS) => {
	suppressErrorsUntil = Date.now() + ms
}

export const isErrorSuppressed = () => Date.now() < suppressErrorsUntil
