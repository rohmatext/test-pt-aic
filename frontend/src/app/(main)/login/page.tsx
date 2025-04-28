'use client';

import InputError from '@/components/input-error';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import AuthLayout from '@/layouts/auth-layout';
import { ErrorBag } from '@/types';
import { useState } from 'react';

export default function Auth() {
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    });

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<ErrorBag>({});
    const [processing, setProcessing] = useState<boolean>(false);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();

        login({
            email,
            password,
            isLoading: setProcessing,
            setErrors,
        });
    };

    return (
        <AuthLayout title="Login ke akun anda" description="Masukan email dan password untuk login">
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            tabIndex={2}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div>
                        <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
                            <Loader isLoading={processing} className="mr-1" />
                            Log in
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
