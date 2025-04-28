'use client';

import axios from '@/lib/axios';
import { ErrorBag } from '@/types';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetchUser = () => {
    const token = Cookies.get('token');
    if (!token) return Promise.reject('No token');

    return axios
        .get('/api/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.data);
};

export const useAuth = ({ middleware, redirectIfAuthenticated }: { middleware?: string; redirectIfAuthenticated?: string } = {}) => {
    const router = useRouter();

    const { data: user, error, mutate } = useSWR('/api/me', fetchUser);

    const login = async ({
        setErrors,
        isLoading,
        ...props
    }: {
        setErrors: (errors: ErrorBag) => void;
        isLoading: (processing: boolean) => void;
    } & Record<string, any>) => {
        setErrors({});
        isLoading(true);

        axios
            .post('/api/login', props)
            .then((res) => {
                const token = res.data.token;
                if (token) {
                    Cookies.set('token', token);
                    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                }

                mutate(fetchUser, { revalidate: true });

                router.push(redirectIfAuthenticated || '/');
            })
            .catch((error: AxiosError) => {
                if (error.response?.status !== 422) throw error;

                const data = error.response?.data as { errors: ErrorBag };
                setErrors(data.errors);
            })
            .finally(() => {
                isLoading(false);
            });
    };

    const logout = async () => {
        if (!error) {
            axios
                .delete('/api/logout', { headers: { Authorization: `Bearer ${Cookies.get('token')}` } })
                .then(() => {
                    Cookies.remove('token');
                    axios.defaults.headers.common.Authorization = '';

                    mutate(fetchUser, { revalidate: true });

                    router.push('/');
                })
                .catch((logoutError) => {
                    console.error('Logout failed', logoutError);
                });
        }

        router.push('/');
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated);

        if (middleware === 'auth' && error) logout();
    }, [user, error]);

    return {
        user,
        login,
        logout,
    };
};
