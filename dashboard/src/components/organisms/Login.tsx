"use client";

import { useState, useContext } from "react";
import { Paper, TextInput, PasswordInput, Button, Text, Stack, Checkbox, Group, Anchor, Alert, Box } from "@mantine/core";
import { HiEnvelope, HiLockClosed } from "react-icons/hi2";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { authRepository } = useContext(RepositoriesContext);
  const { setTokens } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tokens = await authRepository.login(email, password);
      setTokens(tokens);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Paper p={40} radius={32} shadow="xl" style={{ maxWidth: 450, width: '100%' }}>
        <Box className="flex flex-col items-center mb-10">
          <Image
            src="/2-logo-with-text.svg"
            alt="Autobar Logo"
            width={200}
            height={60}
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </Box>

        <form onSubmit={handleLogin}>
          <Stack gap="lg">
            <TextInput
              label="Email"
              placeholder="Enter your email"
              leftSection={<HiEnvelope size={18} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="md"
              fw={600}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              leftSection={<HiLockClosed size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="md"
              fw={600}
            />

            <Group justify="space-between">
              <Checkbox label="Remember me" size="sm" color="blue" />
              <Anchor component="button" type="button" size="sm" fw={600}>
                Forgot password?
              </Anchor>
            </Group>

            {error && (
              <Alert color="red" variant="light" radius="md">
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              loading={loading}
              size="xl"
              fullWidth
              style={{
                height: 56,
                fontSize: '1.125rem',
                fontWeight: 700,
                boxShadow: '0 4px 15px -5px rgba(59, 130, 246, 0.5)',
              }}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
