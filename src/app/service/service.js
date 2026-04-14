const PRIMARY_ENDPOINT = "https://homework-api.noevchanmakara.site/api/v1";

export const authenticate = async (email, password) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/auths/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const createAccount = async (firstName, lastName, email, password, birthdate) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/auths/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password, birthdate }),
    });
    return response.json();
};

export const loadProducts = async (authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/products`, {
        headers: authToken
            ? {
                Authorization: `Bearer ${authToken}`,
            }
            : {},
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        return {
            ...data,
            payload: [],
        };
    }

    return data;
};

export const loadProductById = async (id, authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/products/${id}`, {
        headers: authToken
            ? { Authorization: `Bearer ${authToken}` }
            : {},
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        return null;
    }

    return data;
};

export const saveProduct = async (productData, authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Save operation failed");
    }

    return data;
};

export const reviseProduct = async (id, productData, authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Revision failed");
    }

    return data;
};

export const eliminateProduct = async (id, authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/products/${id}`, {
        method: "DELETE",
        headers: {
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Elimination failed");
    }

    return data;
};

export const loadCollections = async (authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/collections`, {
        headers: authToken
            ? { Authorization: `Bearer ${authToken}` }
            : {},
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        return {
            ...data,
            payload: [],
        };
    }

    return data;
};

export const reviseProductFeedback = async (productId, feedback, authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/products/${productId}/feedback?star=${feedback}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Feedback revision failed");
    }

    return data;
};

export const loadTransactions = async (authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/transactions`, {
        headers: {
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        return {
            ...data,
            payload: [],
        };
    }

    return data;
};

export const saveTransaction = async (transactionData, authToken) => {
    const response = await fetch(`${PRIMARY_ENDPOINT}/transactions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify(transactionData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Transaction save failed");
    }

    return data;
};