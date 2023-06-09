// Types
export interface ApiError extends Error {
    status?: number
}

type ResponsePending = {
    status: 'pending'
}

type ResponseSuccess<T> = {
    status: 'resolved'
    data: T
}

type ResponseError = {
    status: 'rejected'
    error?: ApiError
}

export type ApiResponse<T> =
    | ResponsePending
    | ResponseSuccess<T>
    | ResponseError

// Helpers
const buildHttpError = async (response: Response): Promise<ApiError> => {
    const responseText = await response.text()

    const error = new Error(responseText) as ApiError

    error.name = `${response.status} ${response.statusText}`
    error.status = response.status

    return error
}

export const apiRaw = async (
    url: string,
    init?: RequestInit
): Promise<Response> => {
    // Add API prefix to request URL
    const apiUrl = `${
        process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
    }${url}`

    // Call API
    const response = await fetch(apiUrl, {
        ...init,
        credentials: 'include',
    })

    if (!response.ok) {
        throw await buildHttpError(response)
    }

    return response
}

export const apiFetch = async <T>(
    url: string,
    init?: RequestInit
): Promise<T> => {
    const response = await apiRaw(url, init)

    return await response.json()
}
